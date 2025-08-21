import generator from "generate-password";
import bcrypt from 'bcryptjs';
import { Op, fn, col } from 'sequelize';
import transporter from '../services/email.js';

import Usuario from "../models/Usuario.js";
import UsuarioAnamnese from '../models/UsuarioAnamnese.js';
import UsuarioExameComplementar from '../models/UsuarioExameComplementar.js';
import TipoUsuario from "../models/TipoUsuario.js";
import Orcamento from "../models/Orcamento.js";
import OrcamentoProcedimento from "../models/OrcamentoProcedimento.js";

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
    nome, id_tipo_usuario, dt_nascimento, rg, cpf, estado_civil, sexo, endereco, num_endereco, complemento, cidade, bairro,
    cep, naturalidade, nacionalidade, raca, filhos, telefone, celular, profissao, local_trabalho, email, instagram, facebook
  } = req.body;

  try {
    const idTipoParsed = id_tipo_usuario == null ? null : Number(id_tipo_usuario);
    if (idTipoParsed == null || Number.isNaN(idTipoParsed) || !Number.isInteger(idTipoParsed)) {
      return res.status(400).json({ error: 'id_tipo_usuario inválido ou ausente' });
    }
    const filhosParsed = (filhos === '' || filhos == null) ? null : Number(filhos);
    if (filhosParsed != null && Number.isNaN(filhosParsed)) {
      return res.status(400).json({ error: 'filhos inválido' });
    }
    const dtNascParsed = (dt_nascimento && /^\d{4}-\d{2}-\d{2}$/.test(dt_nascimento))
      ? dt_nascimento
      : null;

    const payload = {
      nome,
      id_tipo_usuario: idTipoParsed,
      filhos: filhosParsed,
      dt_nascimento: dtNascParsed,
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

    const senhaRandom = generateRandomPassword();
    const senhaHash = await bcrypt.hash(senhaRandom, 10);

    const usuario = Usuario.build({
      ...payload,
      senha: senhaHash,
      ic_ativo: true
    });

    await usuario.validate();
    await usuario.save();

    await UsuarioAnamnese.create({ usuario_id: usuario.id, pressao_tipo: 'Normal', diabetico: 'NÃO SABE', prob_cardiaco: 'NÃO SABE', anemia: 'NÃO SABE', hepa: 'NÃO SABE', outra_doenca: 'NÃO SABE' });
    await UsuarioExameComplementar.create({ usuario_id: usuario.id });

    const userData = usuario.toJSON();
    res.status(201).json({
      ...userData,
      senha: senhaRandom
    });

    const mailOptions = {
      from: 'equipeplay2learn@gmail.com',
      to: usuario.email,
      subject: 'Seja bem-vindo(a)',
      html: `
        <h2>Parabéns!</h2>
        <p>Você foi cadastrado no sistema da <strong>Clínica Leutz</strong></p>
        <p><strong>E-mail:</strong> <strong>${usuario.email}</strong><br>
        <strong>Senha:</strong> <strong>${senhaRandom}</strong></p>
      `
    };

    transporter.sendMail(mailOptions)
      .then(info => console.log('Email enviado para usuário:', usuario.email, info?.response || info))
      .catch(err => console.error('Erro ao enviar email (não bloqueia criação):', err));

  } catch (error) {
  
    if (error instanceof Sequelize.UniqueConstraintError || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Já existe um usuário com esse email/CPF.' });
    }
    if (error instanceof Sequelize.ValidationError || error.name === 'SequelizeValidationError') {
      return res
        .status(400)
        .json({ error: 'Dados inválidos: ' + error.errors.map(e => e.message).join('; ') });
    }

    console.error('Erro interno createUser:', error);
    return res.status(500).json({ error: 'Erro interno: ' + (error.message || 'unknown') });
  }
}

export async function getUsers(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  const nomeQuery = req.query.nome || null;

  const where = { id_tipo_usuario: 2 };
  if (nomeQuery) {
    where.nome = { [Op.like]: `%${nomeQuery}%` };
  }

  try {
    const usuarios = await Usuario.findAll({
      where,
      attributes: {
        include: [
          [fn('COUNT', fn('DISTINCT', col('orcamentos.id'))), 'orcamentosCount'],
          [fn('COUNT', fn('DISTINCT', col('procedimentosOrcamento.id'))), 'procedimentosCount'],
          [fn('MAX', col('procedimentosOrcamento.dt_ultimo_retorno')), 'ultimoRetorno']
        ]
      },
      include: [
        {
          model: Orcamento,
          as: 'orcamentos',
          attributes: []
        },
        {
          model: OrcamentoProcedimento,
          as: 'procedimentosOrcamento',
          attributes: []
        }
      ],
      group: ['usuarios.id'],
      ...(limit !== null ? { limit } : {})
    });

    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao buscar usuários', message: error.message });
  }
}

export async function getAniversariantesDoMes(req, res) {
  try {
    const month = new Date().getMonth() + 1; // 1..12

    const aniversariantes = await Usuario.findAll({
      where: where(fn('MONTH', col('dt_nascimento')), month),
      attributes: ['id', 'nome', 'dt_nascimento', 'email'],
      order: [['nome', 'ASC']]
    });

    return res.json(aniversariantes.map(u => u.toJSON()));
  } catch (err) {
    console.error('Erro ao buscar aniversariantes:', err);
    return res.status(500).json({ error: 'Erro ao buscar aniversariantes', message: err.message });
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
  console.log('bateiiiii')
  console.log('req.body', req.body)

  const usuario = await Usuario.findByPk(id)
  const usuarioAnamnese = await UsuarioAnamnese.findOne({ where: { usuario_id: usuario.id } });
  const usuarioExCompl = await UsuarioExameComplementar.findOne({ where: { usuario_id: usuario.id } })

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }

  usuarioAnamnese.set(anamnese);
  usuarioExCompl.set(examesComplementares);

  if (nome) usuario.nome = nome
  if (email) usuario.email = email
  if (senha) { const senhaCriptografada = await bcrypt.hash(senha, 10); usuario.senha = senhaCriptografada; }
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
    await usuarioAnamnese.validate();
  } catch (err) {
    return res.status(400).json({ error: 'Anamnese inválida: ' + err.message });
  }
  try {
    await usuario.validate();
  } catch (err) {
    return res.status(400).json({ error: 'usuario inválida: ' + err.message });
  }
  try {
    await usuarioExCompl.validate();
  } catch (err) {
    return res.status(400).json({ error: 'Exames complementares inválida: ' + err.message });
  }

  try {
    await usuarioAnamnese.save();
  } catch (err) {
    console.error('Erro ao salvar anamnese:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao salvar anamnese: ' + err.message });
  }
  try {
    await usuario.save();
  } catch (err) {
    console.error('Erro ao salvar anamnese:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao salvar usuario: ' + err.message });
  }
  try {
    await usuarioExCompl.save();
  } catch (err) {
    console.error('Erro ao salvar exames compl:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao salvar exames compl: ' + err.message });
  }

  return res.json({
    usuario: usuario.toJSON(),
    anamnese: usuarioAnamnese.toJSON(),
    examesComplementares: usuarioExCompl.toJSON(),

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
  getTipoUsuarios,
  getAniversariantesDoMes
}