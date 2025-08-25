import Usuario from './Usuario.js';
import TipoUsuario from './TipoUsuario.js';
import UsuarioAnamnese from './UsuarioAnamnese.js';
import UsuarioExameComplementar from './UsuarioExameComplementar.js';
import Orcamento from './Orcamento.js';
import OrcamentoProcedimento from './OrcamentoProcedimento.js';
import ProcedimentoFoto from './ProcedimentoFoto.js'; 
import VersionamentoRetorno from './VersionamentoRetorno.js';

TipoUsuario.hasMany(Usuario, { foreignKey: 'id_tipo_usuario', as: 'usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'id_tipo_usuario', as: 'tipo_usuario' });

Usuario.hasOne(UsuarioAnamnese, { foreignKey: 'usuario_id', as: 'anamnese' });
UsuarioAnamnese.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasOne(UsuarioExameComplementar, {
  foreignKey: 'usuario_id',
  as: 'examesComplementares'
});
UsuarioExameComplementar.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

Usuario.hasMany(Orcamento, { foreignKey: 'usuario_id', as: 'orcamentos' });
Orcamento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Orcamento.hasMany(OrcamentoProcedimento, {
  foreignKey: 'orcamento_id',
  as: 'procedimentos'
});
OrcamentoProcedimento.belongsTo(Orcamento, {
  foreignKey: 'orcamento_id',
  as: 'orcamento'
});

Usuario.hasMany(OrcamentoProcedimento, {
  foreignKey: 'usuario_id',
  as: 'procedimentosOrcamento'
});
OrcamentoProcedimento.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

OrcamentoProcedimento.hasMany(ProcedimentoFoto, {
  foreignKey: 'procedimento_id',
  as: 'fotos'
});
ProcedimentoFoto.belongsTo(OrcamentoProcedimento, {
  foreignKey: 'procedimento_id',
  as: 'procedimentoRetornos'
});

OrcamentoProcedimento.hasMany(VersionamentoRetorno, {
  foreignKey: 'procedimento_id',
  as: 'versoes'
});
VersionamentoRetorno.belongsTo(OrcamentoProcedimento, {
  foreignKey: 'procedimento_id',
  as: 'procedimentoRetornos'
});