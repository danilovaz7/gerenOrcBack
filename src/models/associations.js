import Usuario from './Usuario.js';
import TipoUsuario from './TipoUsuario.js';

// TipoUsuario e Usuario
TipoUsuario.hasMany(Usuario, { foreignKey: 'id_tipo_usuario', as: 'usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'id_tipo_usuario', as: 'tipo_usuario' });
