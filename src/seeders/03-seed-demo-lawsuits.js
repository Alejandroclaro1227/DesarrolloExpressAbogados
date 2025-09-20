'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const lawsuits = [
      {
        id: uuidv4(),
        case_number: 'DEM-2025-001',
        plaintiff: 'Empresa XYZ S.A.S',
        defendant: 'Juan Carlos Rodríguez',
        case_type: 'labor',
        status: 'assigned',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440001', // Carlos Pérez
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-002',
        plaintiff: 'María Fernanda López',
        defendant: 'Constructora ABC Ltda',
        case_type: 'civil',
        status: 'assigned',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440002', // Ana María González
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-003',
        plaintiff: 'Estado Colombiano',
        defendant: 'Pedro Antonio Sánchez',
        case_type: 'criminal',
        status: 'resolved',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440003', // Roberto Silva
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-004',
        plaintiff: 'Comercializadora DEF',
        defendant: 'Distribuidora GHI',
        case_type: 'commercial',
        status: 'assigned',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440004', // Laura Martínez
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-005',
        plaintiff: 'Sindicato de Trabajadores',
        defendant: 'Fábrica JKL S.A.',
        case_type: 'labor',
        status: 'pending',
        lawyer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-006',
        plaintiff: 'Andrea Jiménez',
        defendant: 'Carlos Mendoza',
        case_type: 'civil',
        status: 'pending',
        lawyer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-007',
        plaintiff: 'Banco Nacional',
        defendant: 'Inversiones MNO',
        case_type: 'commercial',
        status: 'assigned',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440004', // Laura Martínez
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-008',
        plaintiff: 'Fiscalía General',
        defendant: 'Grupo Criminal Los Tigres',
        case_type: 'criminal',
        status: 'assigned',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440003', // Roberto Silva
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-009',
        plaintiff: 'Empleados Unidos',
        defendant: 'Corporación PQR',
        case_type: 'labor',
        status: 'resolved',
        lawyer_id: '550e8400-e29b-41d4-a716-446655440001', // Carlos Pérez
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        case_number: 'DEM-2025-010',
        plaintiff: 'Ciudadano José García',
        defendant: 'Alcaldía Municipal',
        case_type: 'civil',
        status: 'pending',
        lawyer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('lawsuits', lawsuits, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lawsuits', null, {});
  }
};
