import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const ProcedimentoFoto = database.define('procedimento_fotos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  procedimento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orcamento_procedimentos',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  s3_key: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'procedimento_fotos',
  timestamps: true,
});

export default ProcedimentoFoto;
