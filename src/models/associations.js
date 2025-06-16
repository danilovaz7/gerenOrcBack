import Usuario from './Usuario.js';
import TipoUsuario from './TipoUsuario.js';

// TipoUsuario e Usuario
TipoUsuario.hasMany(Usuario, { foreignKey: 'tipo_usuario_id', as: 'usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario_id', as: 'tipo_usuario' });
