import { Router } from 'express'
import jwt from 'jsonwebtoken'

import express from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
//import transporter from '../services/email.js';

import { authenticate } from '../services/authService.js'
import usuariosController from '../controllers/usuariosController.js'
import orcamentoController from '../controllers/orcamentoController.js';
import loginController from '../controllers/loginController.js'

const router = Router()

router.post('/usuarios', usuariosController.createUser)
router.get('/usuarios', usuariosController.getUsers)
router.get('/usuarios/:id', authenticate,usuariosController.getUserById)
router.put('/usuarios/:id', authenticate, usuariosController.updateUser)
router.delete('/usuarios/:id', authenticate,usuariosController.deleteUser)

router.post('/orcamentos', orcamentoController.createOrcamento)
router.get('/orcamentos', orcamentoController.getOrcamentos)

router.post('/login',loginController.login)
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

        const usuarioDoToken = jwt.verify(token, process.env.SECRET_KEY); // Verifica validade
        res.json(usuarioDoToken);
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado", error: error.message });
    }
}

/*
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const usuario = await Usuario.findOne({ where: { email } });
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      const token = jwt.sign({ userId: usuario.id },  process.env.SECRET_KEY, { expiresIn: '1h' });
  
      const resetLink = `http://localhost:5173/redefinir-senha/${token}`;
      const mailOptions = {
        from: 'equipeplay2learn@gmail.com',
        to: usuario.email,
        subject: 'Recuperação de Senha',
        text: `Clique no link para redefinir sua senha: ${resetLink}`,
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
    const { password } = req.body;
  
    try {

      const decoded = jwt.verify(token, process.env.SECRET_KEY); 
      const usuario = await Usuario.findByPk(decoded.userId);
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
  
      usuario.senha = password;
      await usuario.save();
  
      res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
  });
  */