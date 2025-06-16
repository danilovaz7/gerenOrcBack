// src/models/usuario.js
import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Usuario = database.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  matricula: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  experiencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ic_ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
  }
}, {
  timestamps: true, // Inclui createdAt e updatedAt
});

export default Usuario;
