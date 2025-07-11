import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const Orcamento = database.define('Orcamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  forma_pagamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  arquivo_pdf: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'orcamentos',
  timestamps: true,
});

export default Orcamento;
