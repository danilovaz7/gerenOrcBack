
import Usuario from "../models/Usuario.js";
import TipoUsuario from "../models/TipoUsuario.js";
import { Op, fn, col, where } from 'sequelize';
import { uploadBuffer } from '../services/s3.js';
import { uploadPdf, getPdfUrl } from '../services/s3.js';
import ProcedimentoFoto from '../models/ProcedimentoFoto.js';
import Orcamento from '../models/Orcamento.js';
import OrcamentoProcedimento from '../models/OrcamentoProcedimento.js';
import fs from 'fs';
import path from 'path';
import { gerarPdfOrcamento } from '../utils/gerarPdfOrcamento.js';
import { getUrl } from '../services/s3.js';

export async function createOrcamento(req, res) {
  const sequelize = Orcamento.sequelize;
  const { usuario_id, forma_pagamento, validade, valor_total, valor_parcelado, procedimentos = [] } = req.body;

  const t = await sequelize.transaction();
  try {
    const orcamento = await Orcamento.create({
      usuario_id,
      forma_pagamento,
      validade,
      valor_parcelado,
      valor_total,
      arquivo_pdf: null
    }, { transaction: t });

    const pros = procedimentos.map(p => ({
      nome_procedimento: p.nome_procedimento,
      valor_procedimento: p.valor_procedimento,
      obs_procedimento: p.obs_procedimento,
      usuario_id,
      orcamento_id: orcamento.id,
      status_retorno: p.status_retorno,
      num_retorno: p.num_retorno,
      dt_realizacao: p.dt_realizacao,
      dt_ultimo_retorno: p.dt_ultimo_retorno
    }));
    await OrcamentoProcedimento.bulkCreate(pros, { transaction: t });

    const usuario = await Usuario.findByPk(usuario_id, { transaction: t });
    const nomeUsuario = usuario?.nome || 'Desconhecido';

    const logoPath = path.resolve('public', 'imgs', 'logo.PNG');
    const logoDataUrl = fs.existsSync(logoPath)
      ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
      : null;

    const bufferPDF = await gerarPdfOrcamento(
      { forma_pagamento, validade, valor_parcelado, valor_total, logo: logoDataUrl },
      procedimentos,
      nomeUsuario,
      orcamento.createdAt
    );

    const key = `orcamentos/${orcamento.id}-${Date.now()}.pdf`;
    await uploadPdf(bufferPDF, key);

    orcamento.arquivo_pdf = key;
    await orcamento.save({ transaction: t });

    await t.commit();
    return res.status(201).json({
      message: 'Orçamento e procedimentos criados com sucesso',
      orcamento
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Falha ao criar orçamento e gerar PDF' });
  }
}

export async function getPdfOrcamento(req, res) {
  try {
    const id = req.params.id;
    const orcamento = await Orcamento.findByPk(id, {
      attributes: ['arquivo_pdf']
    });

    if (!orcamento || !orcamento.arquivo_pdf) {
      return res.status(404).json({ error: 'PDF não encontrado' });
    }
    const url = await getPdfUrl(orcamento.arquivo_pdf, 300);

    return res.json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar link do PDF' });
  }
}

export async function uploadFotos(req, res) {
  try {
    const { idProcedimento } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Pega a maior ordem atual
    const lastFoto = await ProcedimentoFoto.findOne({
      where: { procedimento_id: idProcedimento },
      order: [['ordem', 'DESC']],
    });
    let ordemAtual = lastFoto ? lastFoto.ordem + 1 : 1;

    const fotosCriadas = [];
    for (const file of req.files) {
      const extension = file.mimetype.split('/')[1] || 'jpg';
      const key = `procedimentos/${idProcedimento}/${Date.now()}_${Math.random().toString(36).substring(2)}.${extension}`;

      await uploadBuffer(file.buffer, key, file.mimetype);

      const foto = await ProcedimentoFoto.create({
        procedimento_id: idProcedimento,
        s3_key: key,
        ordem: ordemAtual++,
        ativo: true,
      });

      const url = await getUrl(key, 3600);
      fotosCriadas.push({
        id: foto.id,
        key,
        url,
        ordem: foto.ordem
      });
    }

    return res.json({ message: 'Upload realizado', fotos: fotosCriadas });
  } catch (err) {
    console.error('uploadFotos error:', err);
    return res.status(500).json({
      error: err.message || 'Falha no upload',
      stack: err.stack
    });
  }
}

export async function getFotoUrls(req, res) {
  try {
    const { idProcedimento } = req.params;

    const fotos = await ProcedimentoFoto.findAll({
      where: { procedimento_id: idProcedimento, ativo: true },
      order: [['ordem', 'ASC']],
    });

    if (!fotos.length) {
      return res.status(404).json({ error: 'Nenhuma foto encontrada' });
    }

    const fotosComUrls = await Promise.all(
      fotos.map(async f => ({
        id: f.id,
        key: f.s3_key,
        ordem: f.ordem,
        url: await getUrl(f.s3_key, 3600),
      }))
    );

    return res.json({ fotos: fotosComUrls });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar URLs' });
  }
}


export async function deleteFoto(req, res) {
  try {
    const {  fotoId } = req.params;

    const foto = await ProcedimentoFoto.findOne({
      where: { id: fotoId}
    });

    if (!foto) return res.status(404).json({ error: 'Foto não encontrada' });

    const key = foto.s3_key;

    try {
      await deleteKey(key);
    } catch (s3err) {
  
      console.error('Erro ao deletar do S3:', s3err);
    }
   foto.destroy()
    await foto.save();

  
    return res.json({ ok: true, fotoId: foto.id });
  } catch (err) {
    console.error('deleteFoto error:', err);
    return res.status(500).json({ error: err.message || 'Erro ao excluir foto' });
  }
}

export async function replaceFoto(req, res) {
  try {
    const { procId, fotoId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não enviado' });
    }

    // validação básica
    if (!req.file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'Apenas imagens são permitidas' });
    }

    // busca registro existente
    const foto = await ProcedimentoFoto.findOne({
      where: { id: fotoId, procedimento_id: procId },
    });
    if (!foto) return res.status(404).json({ error: 'Foto não encontrada' });

    const oldKey = foto.s3_key;

    // gerar nova key
    const ext = (req.file.originalname?.split('.').pop() || req.file.mimetype.split('/')[1] || 'jpg');
    const newKey = `procedimentos/${procId}/${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;

    // 1) upload novo arquivo para S3
    await uploadBuffer(req.file.buffer, newKey, req.file.mimetype);

    // 2) atualiza DB dentro de transação para consistência (remove vazamento se falhar)
    const sequelize = ProcedimentoFoto.sequelize; // assume model ligado ao db
    const t = await sequelize.transaction();
    try {
      foto.s3_key = newKey;
      await foto.save({ transaction: t });
      await t.commit();
    } catch (dbErr) {
      await t.rollback();
      // remove novo arquivo do S3 para não vazar
      try { await deleteKey(newKey); } catch (e) { console.error('Erro deletando novoKey após rollback:', e); }
      throw dbErr;
    }

    // 3) tenta deletar o antigo (se falhar, apenas logamos)
    try {
      if (oldKey) await deleteKey(oldKey);
    } catch (delErr) {
      console.error('Erro ao deletar key antiga do S3:', delErr);
    }

    // 4) retorna info atualizada com URL assinada
    const url = await getUrl(newKey, 3600);
    return res.json({
      ok: true,
      foto: { id: foto.id, key: newKey, url, ordem: foto.ordem }
    });
  } catch (err) {
    console.error('replaceFoto error:', err);
    return res.status(500).json({ error: err.message || 'Erro ao substituir foto' });
  }
}

export async function getOrcamentos(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  const usuarioId = req.query.usuario_id
    ? parseInt(req.query.usuario_id, 10)
    : null;
  const nomeFiltro = req.query.nome?.trim()?.toLowerCase();

  const orcamentoWhere = {};
  if (usuarioId) {
    orcamentoWhere.usuario_id = usuarioId;
  }

  const includeUsuario = {
    model: Usuario,
    as: 'usuario',
    attributes: []
  };
  if (nomeFiltro) {
    includeUsuario.where = where(
      fn('LOWER', col('usuario.nome')),
      { [Op.like]: `%${nomeFiltro}%` }
    );
  }

  try {
    const orcamentos = await Orcamento.findAll({
      where: orcamentoWhere,
      attributes: {
        include: [
          [fn('COUNT', col('procedimentos.id')), 'procedimentosCount']
        ]
      },
      include: [
        includeUsuario,
        {
          model: OrcamentoProcedimento,
          as: 'procedimentos',
          attributes: []
        }
      ],
      group: ['Orcamento.id'],
      ...(limit != null ? { limit } : {})
    });

    return res.json(Array.isArray(orcamentos) ? orcamentos : []);
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao buscar orçamentos', message: error.message });
  }
}

export async function getOrcamentoById(req, res) {
  const { idOrcamento } = req.params;

  try {
    const orcamento = await Orcamento.findOne({
      where: { id: idOrcamento },

    });

    if (!orcamento) {
      return res.status(404).json({ error: 'orcamento não encontrado' });
    }

    return res.json(orcamento);
  } catch (error) {
    console.error('Erro ao buscar orcamento:', error);
    return res.status(500).json({
      error: 'Erro ao buscar orcamento',
      message: error.message
    });
  }
}

export async function getProximosProcedimentos(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
  const usuarioId = req.query.usuario_id
    ? parseInt(req.query.usuario_id, 10)
    : null;

  const hojeStr = new Date().toISOString().slice(0, 10);

  try {
    const proximos = await OrcamentoProcedimento.findAll({
      where: {
        dt_realizacao: { [Op.gte]: hojeStr }
      },
      include: [
        {
          model: Orcamento,
          as: 'orcamento',
          ...(usuarioId
            ? {
              where: { usuario_id: usuarioId },
              required: true
            }
            : {
              required: false
            }),
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nome']
            }
          ]
        }
      ],
      order: [['dt_realizacao', 'ASC']],
      limit
    });

    return res.json(proximos);
  } catch (error) {
    console.error('Erro ao buscar próximos procedimentos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar próximos procedimentos',
      message: error.message
    });
  }
}

export async function getProcedimentos(req, res) {
  const { nome, status, dt_realizacao, usuario_id } = req.query;
  const usuarioId = usuario_id ? parseInt(usuario_id, 10) : null;

  const include = [
    {
      model: Orcamento,
      as: 'orcamento',
      ...(usuarioId
        ? { where: { usuario_id: usuarioId }, required: true }
        : { required: false }
      ),
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome'],
        }
      ]
    }
  ];

  const where = {};

  if (status) {
    where.status_retorno = { [Op.like]: `%${status}%` };
  }

  if (dt_realizacao) {
    const onlyDate = dt_realizacao.slice(0, 10);
    where.dt_realizacao = { [Op.eq]: onlyDate };
  }

  if (nome) {
    where['$orcamento.usuario.nome$'] = { [Op.like]: `%${nome}%` };
  }

  try {
    const procedimentos = await OrcamentoProcedimento.findAll({
      include,
      where,
      order: [['dt_realizacao', 'DESC']],
    });
    return res.json(procedimentos);
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar procedimentos',
      message: error.message,
    });
  }
}

export async function getProcedimentoById(req, res) {
  const { idProcedimento } = req.params;

  const include = [
    {
      model: Orcamento,
      as: 'orcamento',
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome']
        }
      ]
    }
  ];

  try {
    const procedimento = await OrcamentoProcedimento.findOne({
      where: { id: idProcedimento },
      include
    });

    if (!procedimento) {
      return res.status(404).json({ error: 'Procedimento não encontrado' });
    }

    return res.json(procedimento);
  } catch (error) {
    console.error('Erro ao buscar procedimento:', error);
    return res.status(500).json({
      error: 'Erro ao buscar procedimento',
      message: error.message
    });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      /*include: [
        { model: UsuarioAnamnese, as: 'anamnese' },
      ]*/
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


async function updateOrcamento(req, res) {
  const { idOrcamento } = req.params
  const { status } = req.body;
  console.log(status)

  const orcamento = await Orcamento.findByPk(idOrcamento)

  if (!orcamento) {
    return res.status(404).json({ error: 'orcamento não encontrado' })
  }

  if (status) orcamento.status = status

  try {
    await orcamento.validate();
  } catch (err) {
    return res.status(400).json({ error: 'orcamento inválida: ' + err.message });
  }

  try {
    await orcamento.save();
  } catch (err) {
    console.error('Erro ao salvar orcamento:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao salvar orcamento: ' + err.message });
  }

  return res.json({
    orcamento: orcamento.toJSON(),
  });
}

async function updateProcedimento(req, res) {
  const { idProcedimento } = req.params
  const { status_retorno, dt_realizacao, num_retorno, obs_procedimento } = req.body;

  const procedimento = await OrcamentoProcedimento.findByPk(idProcedimento)

  if (!procedimento) {
    return res.status(404).json({ error: 'procedimento não encontrado' })
  }

  if (status_retorno) procedimento.status_retorno = status_retorno
  if (dt_realizacao) procedimento.dt_realizacao = dt_realizacao
  if (num_retorno) procedimento.num_retorno = num_retorno
  if (obs_procedimento) procedimento.obs_procedimento = obs_procedimento
  procedimento.dt_ultimo_retorno = new Date()


  try {
    await procedimento.validate();
  } catch (err) {
    return res.status(400).json({ error: 'procedimento inválida: ' + err.message });
  }

  try {
    await procedimento.save();
  } catch (err) {
    console.error('Erro ao salvar procedimento:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao salvar procedimento: ' + err.message });
  }

  return res.json({
    procedimento: procedimento.toJSON(),
  });
}

async function deleteOrcamento(req, res) {
  const { idOrcamento } = req.params

  const orcamento = await Orcamento.findByPk(idOrcamento)

  if (!orcamento) {
    return res.status(404).json({ error: 'orcamento não encontrado' })
  }

  try {
    await orcamento.destroy()
    res.json({ message: 'orcamento excluído com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir orcamento: ' + error.message })
  }
}



export default {
  createOrcamento,
  getOrcamentos,
  getOrcamentoById,
  getProximosProcedimentos,
  getProcedimentos,
  getProcedimentoById,
  updateProcedimento,
  deleteOrcamento,
  updateOrcamento,
  getPdfOrcamento,
  uploadFotos,
  getFotoUrls,
  deleteFoto,
  replaceFoto
}