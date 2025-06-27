import { Sequelize } from 'sequelize';
import Usuario from "../models/Usuario.js";
import EloMateria from "../models/EloMateria.js";
import Materia from "../models/Materia.js";
import TipoUsuario from "../models/TipoUsuario.js";
import SalaAluno from "../models/SalaAluno.js";
import Sala from "../models/Sala.js";
import generator from "generate-password";
import bcrypt from 'bcryptjs';
import transporter from '../services/email.js';


export function generateRandomPassword() {
  return generator.generate({
    length: 8,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: false
  });
}

async function createUser(req, res) {
  const { nome, id_tipo_usuario, dt_nascimento, rg, cpf, estado_civil, sexo,
    endereco, num_endereco, complemento, cidade, bairro, cep,
    naturalidade, nacionalidade, raca, telefone, celular, profissao,
    local_trabalho, email, instagram, facebook } = req.body;

  const senhaRandom = generateRandomPassword();
  const senha = await bcrypt.hash(senhaRandom, 10);

  const usuario = Usuario.build({ nome, id_tipo_usuario, dt_nascimento, senha, rg, cpf, estado_civil, sexo, endereco, num_endereco, complemento, cidade, bairro, cep, naturalidade, nacionalidade, raca, telefone, celular, profissao, local_trabalho, email, instagram, facebook, ic_ativo: true });

  try {
    await usuario.validate();
  } catch (error) {
    return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message });
  }

  try {
    await usuario.save();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message });
  }


  const mailOptions = {
    from: '',
    to: usuario.email,
    subject: '',
    html: `
      <h2>Parabéns!</h2>
      <p></p>
      <p>
        <strong>E-mail:</strong> <strong>${usuario.email}</strong><br>
        <strong>Senha:</strong> <strong>${senhaRandom}</strong>
      </p>
    `,
    attachments: [
      {
        filename: '',
        path: '',
        cid: ''
      }
    ]
  };

  await transporter.sendMail(mailOptions);

}

async function getUsers(req, res) {

  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const orderField = req.query.order ? req.query.order : null;
  let orderDirection = req.query.orderDirection ? req.query.orderDirection : 'DESC';

  if (orderField === 'nome') {
    orderDirection = 'ASC';
  }

  const queryOptions = {
    where: { tipo_usuario_id: 2 },
  };

  if (limit !== null) {
    queryOptions.limit = limit;
  }


  try {
    const usuarios = await Usuario.findAll(queryOptions);
    res.json(Array.isArray(usuarios));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
  }
}


async function getUserById(req, res) {
  const { id } = req.params

  const usuario = await Usuario.findByPk(id, { include: ['tipo_usuario', 'avatar'] })

  if (usuario) {
    res.json(usuario.toJSON())
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' })
  }
}

async function getTipoUsuarios(req, res) {
  const tipoUsuarios = await TipoUsuario.findAll()

  if (tipoUsuarios) {
    res.json(tipoUsuarios)
  } else {
    res.status(500).json({ error: 'Erro ao buscar tipoUsuarios' })
  }
}

async function updateUser(req, res) {
  const { id } = req.params
  const { nome, dt_nascimento, estado_civil,
    sexo, endereco, num_endereco, complemento, cidade, bairro, cep,
    naturalidade, nacionalidade, raca, telefone, celular, profissao,
    local_trabalho, email, instagram, facebook, senha } = req.body;

  const usuario = await Usuario.findByPk(id)

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }

  if (nome) usuario.nome = nome
  if (email) usuario.email = email
  if (senha) {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    usuario.senha = senhaCriptografada;
  }
  if (dt_nascimento) usuario.dt_nascimento = dt_nascimento
  if (estado_civil) usuario.estado_civil = estado_civil
  if (sexo) usuario.sexo = sexo
  if (endereco) usuario.endereco = endereco
  if (num_endereco) usuario.num_endereco = num_endereco
  if (complemento) usuario.complemento = complemento
  if (cidade) usuario.cidade = cidade
  if (bairro) usuario.bairro = bairro
  if (cep) usuario.cep = cep
  if (naturalidade) usuario.naturalidade = naturalidade
  if (nacionalidade) usuario.nacionalidade = nacionalidade
  if (raca) usuario.raca = raca
  if (telefone) usuario.telefone = telefone
  if (celular) usuario.celular = celular
  if (profissao) usuario.profissao = profissao
  if (local_trabalho) usuario.local_trabalho = local_trabalho
  if (instagram) usuario.instagram = instagram
  if (facebook) usuario.facebook = facebook

  try {
    await usuario.validate()
  } catch (error) {
    return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message })
  }

  try {
    await usuario.save()
    res.json(usuario.toJSON())
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message })
  }
}

async function deleteUser(req, res) {
  const { id } = req.params

  const usuario = await Usuario.findByPk(id)

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }

  try {
    await usuario.destroy()
    res.json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário: ' + error.message })
  }
}

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTipoUsuarios
}