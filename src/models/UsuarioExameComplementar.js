// src/models/UsuarioExameComplementar.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';
import Usuario from './Usuario.js';

const UsuarioExameComplementar = database.define('usuario_exames_complementares', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onDelete: 'CASCADE',
  },
  peso: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  data_peso: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  tipo_sanguineo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pressao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data_pressao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
}, {
  tableName: 'usuario_exames_complementares',
  timestamps: true,  // createdAt / updatedAt
});


export default UsuarioExameComplementar;
