
import Usuario from "../models/Usuario.js";
import TipoUsuario from "../models/TipoUsuario.js";
import { Op, fn, col } from 'sequelize';
import Orcamento from '../models/Orcamento.js';
import OrcamentoProcedimento from '../models/OrcamentoProcedimento.js';
import fs from 'fs';
import path from 'path';
import { gerarPdfOrcamento } from '../utils/gerarPdfOrcamento.js';

export async function createOrcamento(req, res) {
    const sequelize = Orcamento.sequelize;
    const {
        usuario_id,
        forma_pagamento,
        valor_total,
        procedimentos = []
    } = req.body;

    const t = await sequelize.transaction();

    try {
        const orcamento = await Orcamento.create({
            usuario_id,
            forma_pagamento,
            valor_total,
            arquivo_pdf: null
        }, { transaction: t });

        const pros = procedimentos.map(p => ({
            nome_procedimento: p.nome_procedimento,
            valor_procedimento: p.valor_procedimento,
            orcamento_id: orcamento.id,
            obs_procedimento: p.obs_procedimento,
            usuario_id,
            foto_antes: p.foto_antes,
            foto_depois: p.foto_depois,
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
            { forma_pagamento, valor_total, logo: logoDataUrl },
            procedimentos,
            nomeUsuario,
            orcamento.createdAt
        );

        const nomeArquivo = `orcamento-${orcamento.id}-${Date.now()}.pdf`;
        const dirPdf = path.resolve('public', 'pdfs');
        if (!fs.existsSync(dirPdf)) fs.mkdirSync(dirPdf, { recursive: true });
        const caminhoPdf = path.join(dirPdf, nomeArquivo);
        fs.writeFileSync(caminhoPdf, bufferPDF);

        orcamento.arquivo_pdf = `/pdfs/${nomeArquivo}`;
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

export async function getOrcamentos(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
  const usuarioId = req.query.usuario_id
    ? parseInt(req.query.usuario_id, 10)
    : null;

  // Monta o filtro; se vier usuarioId, aplica só nele
  const where = {};
  if (usuarioId) {
    where.usuario_id = usuarioId;
  }

  try {
    const orcamentos = await Orcamento.findAll({
      where,
      attributes: {
        include: [
          // Conta quantos procedimentos cada orçamento tem
          [fn('COUNT', col('procedimentos.id')), 'procedimentosCount']
        ]
      },
      include: [
        {
          model: OrcamentoProcedimento,
          as: 'procedimentos',
          attributes: []
        }
      ],
      group: ['Orcamento.id'],
      // Aplica o limit apenas se vier na query
      ...(limit != null ? { limit } : {})
    });

    return res.json(orcamentos);
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao buscar orçamentos', message: error.message });
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
          // se vier usuarioId, aplica where e required,
          // caso contrário traz todos (required: false)
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
  const { status, dt_realizacao } = req.query;
  const usuarioId = req.query.usuario_id
    ? parseInt(req.query.usuario_id, 10)
    : null;

  // Monta o include de Orcamento, aplicando filtro por usuário se necessário
  const include = [
    {
      model: Orcamento,
      as: 'orcamento',
      // Se vier usuarioId, só orçamentos dele; senão, todos
      ...(usuarioId
        ? { where: { usuario_id: usuarioId }, required: true }
        : { required: false }),
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome']
        }
      ]
    }
  ];

  // Filtros de status e data
  const where = {};
  if (status) {
    where.status_retorno = { [Op.like]: `%${status}%` };
  }
  if (dt_realizacao) {
    // normaliza para YYYY‑MM‑DD
    const onlyDate = dt_realizacao.slice(0, 10);
    where.dt_realizacao = { [Op.eq]: onlyDate };
  }

  try {
    const procedimentos = await OrcamentoProcedimento.findAll({
      include,
      where,
      order: [['dt_realizacao', 'DESC']]
    });
    return res.json(procedimentos);
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error);
    return res.status(500).json({
      error: 'Erro ao buscar procedimentos',
      message: error.message
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

async function getTipoUsuarios(req, res) {
    const tipoUsuarios = await TipoUsuario.findAll()

    if (tipoUsuarios) {
        res.json(tipoUsuarios)
    } else {
        res.status(500).json({ error: 'Erro ao buscar tipoUsuarios' })
    }
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
    createOrcamento,
    getOrcamentos,
    getProximosProcedimentos,
    getProcedimentos,
    getProcedimentoById,
    updateProcedimento
}