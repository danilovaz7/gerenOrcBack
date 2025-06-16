import Usuario from "../models/Usuario.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


async function login(req, res) {
    console.log('bati aqui');
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Campos faltando' });
    }

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: 'Email ou senha errados' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
        return res.status(404).json({ error: 'Email ou senha errados' });
    }

    const token = jwt.sign(
        { id: user.id, idTipo: user.tipo_usuario_id },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
}

export default { login };
