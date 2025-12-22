'use strict';

const bcrypt = require('bcrypt');

const SEED_KEYWORD = 'SEED::INITIAL';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('password123', 10);
    const hashedPasswordUser = await bcrypt.hash('userpass123', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          firstname: 'Ibrahim',
          lastname: 'KONDO',
          username: 'ibraum',
          email: 'ibraum@example.com',
          password: hashedPasswordAdmin,
          age: 24,
          field: `Computer Science | ${SEED_KEYWORD}`,
          role: 'admin',
          is_active: true,
          login_attempts: 0,
          created_at: new Date(),
          updated_at: new Date()
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
          is_active: true,
          login_attempts: 0,
          created_at: new Date(),
          updated_at: new Date()
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
          is_active: true,
          login_attempts: 0,
          created_at: new Date(),
          updated_at: new Date()
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
          is_active: true,
          login_attempts: 0,
          created_at: new Date(),
          updated_at: new Date()
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
          is_active: false,
          login_attempts: 0,
          created_at: new Date(),
          updated_at: new Date()
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
          is_active: true,
          login_attempts: 0,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;

    await queryInterface.bulkDelete('users', {
      field: {
        [Op.like]: `%SEED::INITIAL%`
      }
    });
  }
};
