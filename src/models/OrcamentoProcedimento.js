import database from '../db/database.js';
import { DataTypes } from 'sequelize';

const OrcamentoProcedimento = database.define('orcamento_procedimentos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nome_procedimento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   obs_procedimento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor_procedimento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  orcamento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orcamentos',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  foto_antes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foto_depois: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status_retorno: {
    type: DataTypes.ENUM('finalizado', 'aguardando procedimento', 'retorno'),
    allowNull: false,
    defaultValue: 'aguardando procedimento',
  },
  num_retorno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  dt_realizacao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  dt_ultimo_retorno: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'orcamento_procedimentos',
  timestamps: true,
});

export default OrcamentoProcedimento;