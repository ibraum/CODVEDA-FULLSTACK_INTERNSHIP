import express from "express";
import morgan from "morgan";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 10;

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

let users = [
  {
    id: 1,
    firstname: "Ibrahim",
    lastname: "KONDO",
    username: "ibraum",
    email: "ibraum@example.com",
    password: "$2b$10$rQ8OQW7h8K9Y6T0F7QZzOe3N4P9S7L2X5C8V1A0J3D6G9H2I5K8L1M4N7O0P3",
    age: 24,
    isActive: true,
    field: "Computer Science",
    role: "admin",
  },
  {
    id: 2,
    firstname: "Amina",
    lastname: "Diallo",
    username: "aminad",
    email: "amina.diallo@example.com",
    password: "$2b$10$rQ8OQW7h8K9Y6T0F7QZzOe3N4P9S7L2X5C8V1A0J3D6G9H2I5K8L1M4N7O0P3",
    age: 22,
    isActive: true,
    field: "Software Engineering",
    role: "user",
  }
];

let nextUserId = 3;

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

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
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

    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: nextUserId++,
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      age: parseInt(age),
      field,
      isActive: true,
      role: 'user'
    };

    users.push(newUser);

    const token = generateToken(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
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

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const token = generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users', authenticateToken, (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  
  const response = {
    message: 'Users retrieved successfully',
    data: usersWithoutPasswords,
  };

  res.status(200).json(response);
});

app.get('/users/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  
  if (isNaN(id) || id < 0) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;

  const response = {
    message: 'User retrieved successfully',
    data: [userWithoutPassword],
  };

  res.status(200).json(response);
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

    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: nextUserId++,
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      age: parseInt(age),
      field,
      isActive: true,
      role: role || 'user'
    };

    users.push(newUser);

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    const response = {
      message: 'User created successfully',
      data: usersWithoutPasswords,
    };

    res.status(201).json(response);

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/users/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const id = Number(req.params.id);
    const updateData = req.body;

    if (isNaN(id) || id < 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (updateData.email || updateData.username) {
      const existingUser = users.find(u => 
        (u.email === updateData.email || u.username === updateData.username) && 
        u.id !== id
      );
      if (existingUser) {
        return res.status(409).json({ 
          message: 'Email or username already exists' 
        });
      }
    }

    const updatedUser = { ...users[userIndex], ...updateData, id };
    users[userIndex] = updatedUser;

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    const response = {
      message: 'User updated successfully',
      data: usersWithoutPasswords,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/users/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id < 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userExists = users.some(u => u.id === id);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    users = users.filter(u => u.id !== id);

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    const response = {
      message: 'User deleted successfully',
      data: usersWithoutPasswords,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/auth/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'User profile retrieved successfully',
    user: req.user.user
  });
});

app.post('/auth/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /auth/signup': 'Create new user account',
        'POST /auth/login': 'User login',
        'GET /auth/me': 'Get current user profile',
        'POST /auth/logout': 'User logout'
      },
      users: {
        'GET /users': 'Get all users (auth required)',
        'GET /users/:id': 'Get specific user (auth required)',
        'POST /users': 'Create user (admin only)',
        'PUT /users/:id': 'Update user (admin only)',
        'DELETE /users/:id': 'Delete user (admin only)'
      }
    }
  });
});

app.listen(PORT, (err) => {
  if (err) console.error("Error starting server:", err.message);
  console.log(`Server is running on: http://localhost:${PORT}`);
  console.log('Default admin credentials:');
  console.log('Email: ibraum@example.com');
  console.log('Password: password123');
});
