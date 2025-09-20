'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(12);
    
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        username: 'admin',
        password: await bcrypt.hash('admin123', salt),
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        username: 'operator',
        password: await bcrypt.hash('operator123', salt),
        role: 'operator',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        username: 'maria.garcia',
        password: await bcrypt.hash('maria123', salt),
        role: 'operator',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
