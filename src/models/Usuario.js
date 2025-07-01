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
  id_tipo_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipo_usuarios',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  dt_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  rg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  estado_civil: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  num_endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  complemento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  naturalidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nacionalidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    filhos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profissao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  local_trabalho: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ic_ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  timestamps: true, // createdAt and updatedAt
  tableName: 'usuarios',
});

export default Usuario;
