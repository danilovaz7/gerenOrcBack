import Usuario from './Usuario.js';
import TipoUsuario from './TipoUsuario.js';
import UsuarioAnamnese from './UsuarioAnamnese.js';
import UsuarioExameComplementar from './UsuarioExameComplementar.js';

// TipoUsuario ↔ Usuario
TipoUsuario.hasMany(Usuario, { foreignKey: 'id_tipo_usuario', as: 'usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'id_tipo_usuario', as: 'tipo_usuario' });

// Usuario ↔ Anamnese (1:1)
Usuario.hasOne(UsuarioAnamnese, { foreignKey: 'usuario_id', as: 'anamnese' });
UsuarioAnamnese.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Usuario ↔ Exames Complementares (1:1)
Usuario.hasOne(UsuarioExameComplementar, { foreignKey: 'usuario_id', as: 'examesComplementares' });
UsuarioExameComplementar.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
