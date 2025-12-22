'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('userpass123', 10);

    await queryInterface.bulkInsert('users', [
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
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
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
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      id: [1, 2, 3, 4, 5, 6]
    });
  }
};