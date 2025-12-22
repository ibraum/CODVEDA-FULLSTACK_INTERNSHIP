# Task 1 Backend - Database Integration with PostgreSQL

This backend application implements a complete user management system with authentication, authorization, and database integration using PostgreSQL and Sequelize ORM.

## 🚀 Features Implemented

### Task 2: Authentication and Authorization
- ✅ User authentication with bcrypt password hashing
- ✅ JWT (JSON Web Tokens) for secure authentication
- ✅ Role-based access control (Admin/User roles)
- ✅ Secure token storage and validation
- ✅ Protected routes with middleware

### Task 3: Database Integration
- ✅ PostgreSQL database integration with Sequelize ORM
- ✅ Complete CRUD operations on user data
- ✅ Database models with proper relationships
- ✅ Database indexing for performance optimization
- ✅ Comprehensive data validation
- ✅ Database migrations and seeding
- ✅ Connection pooling and optimization

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM for database operations
- **bcrypt** - Password hashing
- **JWT** - JSON Web Tokens for authentication
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # Database configuration
│   └── config.json         # Sequelize configuration
├── models/
│   ├── User.js             # User model with validation and methods
│   └── index.js           # Models index file
├── migrations/
│   └── 20240101000001-create-users.js  # Database migration
├── seeders/
│   └── 20240101000001-demo-users.js    # Database seeder
├── scripts/
│   └── setupDatabase.js    # Database setup script
├── .env.example           # Environment variables template
└── server.js              # Main application file
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  field VARCHAR(100) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  lastLogin TIMESTAMP,
  loginAttempts INTEGER DEFAULT 0,
  lockedUntil TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Database Indexes

- **Unique Indexes**: `email`, `username`
- **Performance Indexes**: `role`, `isActive`, `createdAt`

## 📋 API Endpoints

### Authentication Endpoints
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login with JWT
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - User logout

### User Management Endpoints
- `GET /users` - Get all users with pagination (auth required)
- `GET /users/:id` - Get specific user (auth required)
- `POST /users` - Create user (admin only)
- `PUT /users/:id` - Update user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

## 🔧 Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 2. Database Setup

1. **Create PostgreSQL database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE codveda_db;
```

2. **Configure Environment:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codveda_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Database
```bash
# Run database setup with sample data
npm run setup-db
```

### 5. Start Server
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

## 🎯 Default Credentials

### Admin User
- **Email**: ibraum@example.com
- **Password**: password123
- **Role**: Admin

### Regular User
- **Email**: amina.diallo@example.com  
- **Password**: password123
- **Role**: User

## 🔒 Security Features

### Password Security
- **bcrypt** hashing with 10 salt rounds
- Minimum 8 characters password requirement
- Password validation during creation/update

### Authentication Security
- **JWT tokens** with 7-day expiration
- Account lockout after 5 failed attempts (2-hour lock)
- Token validation middleware
- Role-based access control

### Data Validation
- Comprehensive Sequelize validations
- Input sanitization and trimming
- Unique constraint enforcement
- Data type validation

## 📈 Performance Optimizations

### Database Optimization
- **Connection pooling** (max: 10, min: 0)
- **Database indexing** on frequently queried fields
- **Pagination** for large datasets
- **Query optimization** with selective field retrieval

### Application Optimization
- **Password hashing** with bcrypt (optimal salt rounds)
- **JWT token** expiration and validation
- **Error handling** with proper HTTP status codes
- **Logging** with Morgan for debugging

## 🧪 Testing

### Manual Testing
1. **Authentication Flow:**
   - Signup with new user credentials
   - Login and receive JWT token
   - Access protected routes with token
   - Test role-based access control

2. **CRUD Operations:**
   - Get users with pagination
   - Create/update/delete users (admin only)
   - Test data validation and error handling

### API Testing
```bash
# Test server health
curl http://localhost:3000

# Test user registration
curl -X POST http://localhost:3000/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"firstname":"John","lastname":"Doe","username":"johndoe","email":"john@example.com","password":"password123","age":25,"field":"Engineering"}'

# Test user login
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"ibraum@example.com","password":"password123"}'
```

## 🚨 Error Handling

### Database Errors
- **Validation errors**: 400 Bad Request with field details
- **Unique constraint violations**: 409 Conflict
- **Foreign key violations**: 400 Bad Request
- **Database connection errors**: 500 Internal Server Error

### Authentication Errors
- **Missing token**: 401 Unauthorized
- **Invalid/Expired token**: 403 Forbidden
- **Account locked**: 423 Locked
- **Insufficient permissions**: 403 Forbidden

## 🔄 Database Migrations

### Create New Migration
```bash
npx sequelize-cli migration:generate --name new-migration-name
```

### Run Migrations
```bash
npx sequelize-cli db:migrate
```

### Undo Migration
```bash
npx sequelize-cli db:migrate:undo
```

## 🌱 Database Seeding

### Run Seeders
```bash
npx sequelize-cli db:seed:all
```

### Create New Seeder
```bash
npx sequelize-cli seed:generate --name new-seeder-name
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | codveda_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `NODE_ENV` | Environment mode | development |

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Verify PostgreSQL is running
   - Check database credentials in .env
   - Ensure database exists

2. **Migration Errors:**
   - Drop and recreate database: `DROP DATABASE codveda_db; CREATE DATABASE codveda_db;`
   - Run setup script: `npm run setup-db`

3. **Permission Denied:**
   - Check database user permissions
   - Verify .env file is correctly configured

### Debug Mode
Set `NODE_ENV=development` in .env for detailed database logs.

## 📚 Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Documentation](https://jwt.io/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

---

**Author:** KONDO Ibrahim  
**Version:** 2.0.0  
**License:** ISC