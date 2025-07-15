
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
    const nomePaciente = req.query.nome || null;

    let usuarioIds = null;
    if (nomePaciente) {
        const usuarios = await Usuario.findAll({
            where: {
                nome: { [Op.like]: `%${nomePaciente}%` }
            },
            attributes: ['id']
        });
        usuarioIds = usuarios.map(u => u.id);
        if (usuarioIds.length === 0) {
            return res.json([]);
        }
    }

    const where = {};
    if (usuarioIds) {
        where.usuario_id = { [Op.in]: usuarioIds };
    }

    try {
        const orcamentos = await Orcamento.findAll({
            where,
            attributes: {
                include: [
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

async function updateUser(req, res) {
    const { id } = req.params
    const { nome } = req.body;

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    if (nome) usuario.nome = nome

    try {
        await usuario.validate();
    } catch (err) {
        return res.status(400).json({ error: 'usuario inválida: ' + err.message });
    }

    try {
        await usuario.save();
    } catch (err) {
        console.error('Erro ao salvar anamnese:', err);
        return res
            .status(500)
            .json({ error: 'Erro ao salvar usuario: ' + err.message });
    }


    return res.json({
        usuario: usuario.toJSON(),
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
}