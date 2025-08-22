import { Router } from 'express'
import jwt from 'jsonwebtoken'

import express from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import transporter from '../services/email.js';


import {uploadMemory} from '../services/multer.js'
import { authenticate } from '../services/authService.js'
import usuariosController from '../controllers/usuariosController.js'
import orcamentoController from '../controllers/orcamentoController.js';
import loginController from '../controllers/loginController.js'

const router = Router()

router.post('/usuarios', usuariosController.createUser)
router.get('/usuarios', usuariosController.getUsers)
router.get('/usuarios/:id', authenticate, usuariosController.getUserById)
router.get('/aniversariantes', authenticate, usuariosController.getAniversariantesDoMes)
router.put('/usuarios/:id', authenticate, usuariosController.updateUser)
router.delete('/usuarios/:id', authenticate, usuariosController.deleteUser)

router.post('/orcamentos', orcamentoController.createOrcamento)
router.get('/orcamentos', orcamentoController.getOrcamentos)
router.get('/orcamentos/:idOrcamento', orcamentoController.getOrcamentoById)
router.put('/orcamentos/:idOrcamento', orcamentoController.updateOrcamento)
router.get('/proximos-procedimentos', orcamentoController.getProximosProcedimentos)
router.delete('/orcamentos/:idOrcamento', orcamentoController.deleteOrcamento)
router.get('/procedimentos', orcamentoController.getProcedimentos)
router.get('/procedimento/:idProcedimento', orcamentoController.getProcedimentoById)
router.put('/procedimento/:idProcedimento', orcamentoController.updateProcedimento)
router.get('/orcamento/:id/pdf', orcamentoController.getPdfOrcamento)
router.post('/procedimento/:idProcedimento/upload',uploadMemory.array('files', 10), orcamentoController.uploadFotos);
router.get('/procedimento/:idProcedimento/url', orcamentoController.getFotoUrls);
router.delete('/procedimento/foto/:fotoId',  orcamentoController.deleteFoto);
router.put('/procedimento/:procId/foto/:fotoId/replace',uploadMemory.single('file'), orcamentoController.replaceFoto);


router.post('/login', loginController.login)
router.get('/eu', pegarUsuarioDoToken)

export default router


function checaToken(req, res, next) {
  const headers = req.headers;

  const authorizationHeader = headers.authorization;
  if (!authorizationHeader) {
    return res.status(403).json({ message: "Forbidden" })
  }
  const [, token] = authorizationHeader.split(' ');
  if (!token) {
    return res.status(403).json({ message: "Forbidden" })
  }

  next();
}

function pegarUsuarioDoToken(req, res) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Token ausente ou inválido" });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Token inválido" });
    }

    const usuarioDoToken = jwt.verify(token, process.env.SECRET_KEY);
    res.json(usuarioDoToken);
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado", error: error.message });
  }
}


router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const token = jwt.sign({ userId: usuario.id }, process.env.SECRET_KEY, { expiresIn: '1h' });


    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha/${token}`;
    const mailOptions = {
      from: 'admclinicaleutz@gmail.com@gmail.com',
      to: usuario.email,
      subject: 'Recuperação de Senha',
      html: `
      <h2>Olá, como vai</h2>
      <p>Foi pedido um link para troca de senha, segue o link abaixo</p>
      <p>
        <strong>${resetLink}><br>
      </p>
    `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Link de recuperação de senha enviado para seu e-mail.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;
  try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const usuario = await Usuario.findByPk(decoded.userId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    usuario.senha = senhaHash;
    await usuario.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
});
