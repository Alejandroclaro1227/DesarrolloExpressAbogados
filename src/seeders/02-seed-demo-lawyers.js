'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const lawyers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Carlos Pérez',
        email: 'carlos.perez@bufete.com',
        phone: '3001234567',
        specialization: 'Laboral',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Ana María González',
        email: 'ana.gonzalez@bufete.com',
        phone: '3007654321',
        specialization: 'Civil',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Roberto Silva',
        email: 'roberto.silva@bufete.com',
        phone: '3009876543',
        specialization: 'Penal',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Laura Martínez',
        email: 'laura.martinez@bufete.com',
        phone: '3005432167',
        specialization: 'Comercial',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Diego Ramírez',
        email: 'diego.ramirez@bufete.com',
        phone: '3008765432',
        specialization: 'Familia',
        status: 'inactive',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('lawyers', lawyers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lawyers', null, {});
  }
};
