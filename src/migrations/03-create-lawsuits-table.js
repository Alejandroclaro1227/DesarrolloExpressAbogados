'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lawsuits', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      case_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      plaintiff: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      defendant: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      case_type: {
        type: Sequelize.ENUM('civil', 'criminal', 'labor', 'commercial'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'assigned', 'resolved'),
        allowNull: false,
        defaultValue: 'pending',
      },
      lawyer_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'lawyers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Crear índices para optimización
    await queryInterface.addIndex('lawsuits', ['case_number']);
    await queryInterface.addIndex('lawsuits', ['status']);
    await queryInterface.addIndex('lawsuits', ['case_type']);
    await queryInterface.addIndex('lawsuits', ['lawyer_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lawsuits');
  }
};
