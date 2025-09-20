const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Lawyer = sequelize.define('Lawyer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 15],
      },
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  }, {
    tableName: 'lawyers',
  });

  Lawyer.associate = (models) => {
    Lawyer.hasMany(models.Lawsuit, {
      foreignKey: 'lawyer_id',
      as: 'lawsuits',
    });
  };

  return Lawyer;
};

