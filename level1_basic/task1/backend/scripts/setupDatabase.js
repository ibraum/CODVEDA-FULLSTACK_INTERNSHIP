import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const SEED_KEYWORD = 'SEED::INITIAL';

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
    
    const User = (await import('../models/User.js')).default;
    
    const hashedPasswordAdmin = await bcrypt.hash('password123', 10);
    const hashedPasswordUser = await bcrypt.hash('userpass123', 10);
    
    await User.bulkCreate([
      {
        firstname: 'Ibrahim',
        lastname: 'KONDO',
        username: 'ibraum',
        email: 'ibraum@example.com',
        password: hashedPasswordAdmin,
        age: 24,
        field: `Computer Science | ${SEED_KEYWORD}`,
        role: 'admin',
        isActive: true,
        loginAttempts: 0
      },
      {
        firstname: 'Amina',
        lastname: 'Diallo',
        username: 'aminad',
        email: 'amina.diallo@example.com',
        password: hashedPasswordUser,
        age: 22,
        field: `Software Engineering | ${SEED_KEYWORD}`,
        role: 'user',
        isActive: true,
        loginAttempts: 0
      },
      {
        firstname: 'Jean',
        lastname: 'Dupont',
        username: 'jdupont',
        email: 'jean.dupont@example.com',
        password: hashedPasswordUser,
        age: 27,
        field: `Web Development | ${SEED_KEYWORD}`,
        role: 'user',
        isActive: true,
        loginAttempts: 0
      },
      {
        firstname: 'Sarah',
        lastname: 'Mensah',
        username: 'sarahm',
        email: 'sarah.mensah@example.com',
        password: hashedPasswordUser,
        age: 25,
        field: `Information Systems | ${SEED_KEYWORD}`,
        role: 'user',
        isActive: true,
        loginAttempts: 0
      },
      {
        firstname: 'Michael',
        lastname: 'Brown',
        username: 'mbrown',
        email: 'michael.brown@example.com',
        password: hashedPasswordUser,
        age: 29,
        field: `Data Science | ${SEED_KEYWORD}`,
        role: 'user',
        isActive: false,
        loginAttempts: 0
      },
      {
        firstname: 'Fatou',
        lastname: 'Sow',
        username: 'fatous',
        email: 'fatou.sow@example.com',
        password: hashedPasswordUser,
        age: 23,
        field: `Cybersecurity | ${SEED_KEYWORD}`,
        role: 'user',
        isActive: true,
        loginAttempts: 0
      }
    ]);
    
    console.log('Sample users created successfully.');
    console.log('\nDefault credentials:');
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
