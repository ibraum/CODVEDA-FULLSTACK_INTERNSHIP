import express from "express";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from './config/database.js';
import User from './models/User.js';
import { Op } from 'sequelize';

dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || '';

const app = express();

const corsOptions = {
  origin: [
    "http://127.0.0.1:8080", 
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    "http://127.0.0.1:5500", 
    "http://localhost:5500"
  ],
  credentials: true
};

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        age: user.age,
        isActive: user.isActive,
        field: user.field,
        role: user.role
      }
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions' 
      });
    }

    next();
  };
};

const handleSequelizeError = (error) => {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    return { status: 400, message: 'Validation error', errors };
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0].path;
    return { 
      status: 409, 
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
    };
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return { status: 400, message: 'Invalid reference' };
  }

  return { status: 500, message: 'Internal server error' };
};

app.post('/auth/signup', async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, age, field } = req.body;

    if (!firstname || !lastname || !username || !email || !password || !age || !field) {
      return res.status(400).json({
        message: 'All fields are required',
        required: ['firstname', 'lastname', 'username', 'email', 'password', 'age', 'field']
      });
    }

    const existingUser = await User.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const newUser = await User.create({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      age: parseInt(age),
      field: field.trim(),
      role: 'user'
    });

    const token = generateToken(newUser);

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isLocked()) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to too many failed attempts' 
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    await user.resetLoginAttempts();

    const token = generateToken(user);

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.get('/users', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      id: { [Op.ne]: req.user.id }
    };
    if (role) whereClause.role = role;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    const response = {
      message: 'Users retrieved successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Get users error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response = {
      message: 'User retrieved successfully',
      data: [user]
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Get user error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.post('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, age, field, role } = req.body;

    if (!firstname || !lastname || !username || !email || !password || !age || !field) {
      return res.status(400).json({
        message: 'All fields are required',
        required: ['firstname', 'lastname', 'username', 'email', 'password', 'age', 'field']
      });
    }

    const existingUser = await User.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const newUser = await User.create({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      age: parseInt(age),
      field: field.trim(),
      role: role || 'user'
    });

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    const response = {
      message: 'User created successfully',
      data: users
    };

    res.status(201).json(response);

  } catch (error) {
    console.error('Create user error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.put('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updateData.email || updateData.username) {
      const existingUser = await User.findOne({
        where: {
          [sequelize.Sequelize.Op.or]: [
            { email: updateData.email?.toLowerCase().trim() },
            { username: updateData.username?.toLowerCase().trim() }
          ],
          id: { [sequelize.Sequelize.Op.ne]: id }
        }
      });

      if (existingUser) {
        return res.status(409).json({ 
          message: 'Email or username already exists' 
        });
      }
    }

    await user.update(updateData);

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    const response = {
      message: 'User updated successfully',
      data: users
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Update user error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.delete('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    const response = {
      message: 'User deleted successfully',
      data: users
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Delete user error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    const errorResponse = handleSequelizeError(error);
    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors
    });
  }
});

app.post('/auth/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is running with PostgreSQL database',
    version: '2.0.0',
    database: 'PostgreSQL with Sequelize ORM',
    endpoints: {
      auth: {
        'POST /auth/signup': 'Create new user account',
        'POST /auth/login': 'User login',
        'GET /auth/me': 'Get current user profile',
        'POST /auth/logout': 'User logout'
      },
      users: {
        'GET /users': 'Get all users with pagination (auth required)',
        'GET /users/:id': 'Get specific user (auth required)',
        'POST /users': 'Create user (admin only)',
        'PUT /users/:id': 'Update user (admin only)',
        'DELETE /users/:id': 'Delete user (admin only)'
      }
    }
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');

    app.listen(PORT, (err) => {
      if (err) {
        console.error("Error starting server:", err.message);
        process.exit(1);
      }
      console.log(`Server is running on: http://localhost:${PORT}`);
      console.log('Database: PostgreSQL with Sequelize ORM');
      console.log('Default admin credentials:');
      console.log('Email: ibraum@example.com');
      console.log('Password: password123');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();