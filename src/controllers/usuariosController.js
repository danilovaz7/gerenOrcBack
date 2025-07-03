import { Sequelize } from 'sequelize';
import Usuario from "../models/Usuario.js";
import UsuarioAnamnese from '../models/UsuarioAnamnese.js';
import UsuarioExameComplementar from '../models/UsuarioExameComplementar.js';
import TipoUsuario from "../models/TipoUsuario.js";
import generator from "generate-password";
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { Where } from 'sequelize/lib/utils';
//import transporter from '../services/email.js';

export function generateRandomPassword() {
  return generator.generate({
    length: 8,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: false
  });
}

export async function createUser(req, res) {
  let {
    nome,
    id_tipo_usuario,
    dt_nascimento,
    rg,
    cpf,
    estado_civil,
    sexo,
    endereco,
    num_endereco,
    complemento,
    cidade,
    bairro,
    cep,
    naturalidade,
    nacionalidade,
    raca,
    filhos,
    telefone,
    celular,
    profissao,
    local_trabalho,
    email,
    instagram,
    facebook
  } = req.body;

  try {
    // --- monta payload dos campos do usuário ---
    const payload = {
      nome,
      id_tipo_usuario: parseInt(id_tipo_usuario, 10),
      filhos: filhos ? parseInt(filhos, 10) : null,
      dt_nascimento: dt_nascimento && /^\d{4}-\d{2}-\d{2}$/.test(dt_nascimento)
        ? dt_nascimento
        : null,
      rg,
      cpf,
      estado_civil,
      sexo,
      endereco,
      num_endereco,
      complemento,
      cidade,
      bairro,
      cep,
      naturalidade,
      nacionalidade,
      raca,
      telefone,
      celular,
      profissao,
      local_trabalho,
      email,
      instagram,
      facebook
    };

    // --- gera e criptografa a senha ---
    const senhaRandom = generateRandomPassword();
    const senhaHash = await bcrypt.hash(senhaRandom, 10);

    // --- instancia e salva o usuário ---
    const usuario = Usuario.build({
      ...payload,
      senha: senhaHash,
      ic_ativo: true
    });
    await usuario.validate();
    await usuario.save();

    // --- cria registros iniciais nas tabelas filhas ---
    // usando o modelo diretamente:
    await UsuarioAnamnese.create({ usuario_id: usuario.id });
    await UsuarioExameComplementar.create({ usuario_id: usuario.id });

    // --- devolve o user criado com a senha em texto ---
    const userData = usuario.toJSON();
    return res.status(201).json({
      ...userData,
      senha: senhaRandom
    });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res
        .status(400)
        .json({ error: 'Dados inválidos: ' + error.errors.map(e => e.message).join('; ') });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno: ' + error.message });
  }
}


export async function getUsers(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  const nomeQuery = req.query.nome || null;

  const where = { id_tipo_usuario: 2 };
  if (nomeQuery) {
    where.nome = {
      [Op.like]: `%${nomeQuery}%`
    };
  }

  const queryOptions = { where };
  if (limit !== null) queryOptions.limit = limit;

  try {
    const usuarios = await Usuario.findAll(queryOptions);
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      include: [
        { model: UsuarioAnamnese, as: 'anamnese' },
        { model: UsuarioExameComplementar, as: 'examesComplementares' },
      ]
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(usuario.toJSON());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno' });
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
    sexo, endereco, num_endereco, complemento, cidade, rg, cpf, bairro, cep,
    naturalidade, nacionalidade, raca, telefone, celular, profissao, filhos,
    local_trabalho, email, instagram, facebook, senha, anamnese, examesComplementares } = req.body;

  const usuario = await Usuario.findByPk(id)
  const usuarioAnamnese = await UsuarioAnamnese.findOne({ Where: { usuario_id: id } })

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }


  if (anamnese.comp_trat_odon !== undefined) usuarioAnamnese.comp_trat_odon = anamnese.comp_trat_odon
  if (anamnese.comp_trat_odon_obs !== undefined) usuarioAnamnese.comp_trat_odon_obs = anamnese.comp_trat_odon_obs
  if (anamnese.em_trat_medico !== undefined) usuarioAnamnese.em_trat_medico = anamnese.em_trat_medico
  if (anamnese.em_trat_medico_obs !== undefined) usuarioAnamnese.em_trat_medico_obs = anamnese.em_trat_medico_obs
  if (anamnese.transfusao !== undefined) usuarioAnamnese.transfusao = anamnese.transfusao
  if (anamnese.transfusao_obs !== undefined) usuarioAnamnese.transfusao_obs = anamnese.transfusao_obs
  if (anamnese.doenca_grave !== undefined) usuarioAnamnese.doenca_grave = anamnese.doenca_grave
  if (anamnese.doenca_grave_obs !== undefined) usuarioAnamnese.doenca_grave_obs = anamnese.doenca_grave_obs
  if (anamnese.alergia_geral !== undefined) usuarioAnamnese.alergia_geral = anamnese.alergia_geral
  if (anamnese.alergia_geral_obs !== undefined) usuarioAnamnese.alergia_geral_obs = anamnese.alergia_geral_obs
  if (anamnese.hospitalizado !== undefined) usuarioAnamnese.hospitalizado = anamnese.hospitalizado
  if (anamnese.hospitalizado_obs !== undefined) usuarioAnamnese.hospitalizado_obs = anamnese.hospitalizado_obs
  if (anamnese.submetido_cirurgia !== undefined) usuarioAnamnese.submetido_cirurgia = anamnese.submetido_cirurgia
  if (anamnese.cirurgia_obs !== undefined) usuarioAnamnese.cirurgia_obs = anamnese.cirurgia_obs
  if (anamnese.recebeu_anestesia !== undefined) usuarioAnamnese.recebeu_anestesia = anamnese.recebeu_anestesia
  if (anamnese.comp_anestesia !== undefined) usuarioAnamnese.comp_anestesia = anamnese.comp_anestesia
  if (anamnese.comp_anestesia_obs !== undefined) usuarioAnamnese.comp_anestesia_obs = anamnese.comp_anestesia_obs
  if (anamnese.dor_dente !== undefined) usuarioAnamnese.dor_dente = anamnese.dor_dente
  if (anamnese.dor_dente_obs !== undefined) usuarioAnamnese.dor_dente_obs = anamnese.dor_dente_obs
  if (anamnese.protese_cardiaca !== undefined) usuarioAnamnese.protese_cardiaca = anamnese.protese_cardiaca
  if (anamnese.protese_cardiaca_obs !== undefined) usuarioAnamnese.protese_cardiaca_obs = anamnese.protese_cardiaca_obs
  if (anamnese.sangramento_anormal !== undefined) usuarioAnamnese.sangramento_anormal = anamnese.sangramento_anormal
  if (anamnese.sangramento_anormal_obs !== undefined) usuarioAnamnese.sangramento_anormal_obs = anamnese.sangramento_anormal_obs


  if (nome) usuario.nome = nome
  if (email) usuario.email = email
  if (senha) {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    usuario.senha = senhaCriptografada;
  }
  if (dt_nascimento) usuario.dt_nascimento = dt_nascimento
  if (estado_civil) usuario.estado_civil = estado_civil
  if (sexo) usuario.sexo = sexo
  if (rg) usuario.rg = rg
  if (cpf) usuario.cpf = cpf
  if (filhos) usuario.filhos = filhos
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
    await usuario.validate();
    await usuarioAnamnese.validate();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Dados inválidos: ' + err.message });
  }

  // 2) salvamentos
  try {
    // se você estiver usando transação, inclua aqui os saves dentro dela
    await usuario.save();
    await usuarioAnamnese.save();
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Erro ao salvar dados: ' + err.message });
  }

  // 3) envia **uma** resposta só, com tudo atualizado
  return res.json({
    usuario: usuario.toJSON(),
    anamnese: usuarioAnamnese.toJSON(),
  });
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