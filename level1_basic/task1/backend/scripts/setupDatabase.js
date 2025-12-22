import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
    
    const User = (await import('../models/User.js')).default;
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('userpass123', 10);
    
    await User.bulkCreate([
      {
        id: 1,
        firstname: 'Ibrahim',
        lastname: 'KONDO',
        username: 'ibraum',
        email: 'ibraum@example.com',
        password: hashedPassword,
        age: 24,
        field: 'Computer Science',
        role: 'admin',
        isActive: true,
        loginAttempts: 0
      },
      {
        id: 2,
        firstname: 'Amina',
        lastname: 'Diallo',
        username: 'aminad',
        email: 'amina.diallo@example.com',
        password: hashedPassword2,
        age: 22,
        field: 'Software Engineering',
        role: 'user',
        isActive: true,
        loginAttempts: 0
      },
      {
        id: 3,
        firstname: 'Jean',
        lastname: 'Dupont',
        username: 'jdupont',
        email: 'jean.dupont@example.com',
        password: hashedPassword2,
        age: 27,
        field: 'Web Development',
        role: 'user',
        isActive: true,
        loginAttempts: 0
      },
      {
        id: 4,
        firstname: 'Sarah',
        lastname: 'Mensah',
        username: 'sarahm',
        email: 'sarah.mensah@example.com',
        password: hashedPassword2,
        age: 25,
        field: 'Information Systems',
        role: 'user',
        isActive: true,
        loginAttempts: 0
      },
      {
        id: 5,
        firstname: 'Michael',
        lastname: 'Brown',
        username: 'mbrown',
        email: 'michael.brown@example.com',
        password: hashedPassword2,
        age: 29,
        field: 'Data Science',
        role: 'user',
        isActive: false,
        loginAttempts: 0
      },
      {
        id: 6,
        firstname: 'Fatou',
        lastname: 'Sow',
        username: 'fatous',
        email: 'fatou.sow@example.com',
        password: hashedPassword2,
        age: 23,
        field: 'Cybersecurity',
        role: 'user',
        isActive: true,
        loginAttempts: 0
      }
    ]);
    
    console.log('Sample users created successfully.');
    console.log('\\nDefault credentials:');
    console.log('Admin: ibraum@example.com / password123');
    console.log('User: amina.diallo@example.com / userpass123');
    
    await sequelize.close();
    console.log('Database setup completed.');
    
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();