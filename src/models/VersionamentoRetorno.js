import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const VersionamentoRetorno = database.define('versionamento_retornos', {
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
  num_retorno: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  descricao: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  dt_retorno: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'versionamento_retornos',
  timestamps: true,
});

export default VersionamentoRetorno;
