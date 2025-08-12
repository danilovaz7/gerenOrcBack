import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import './models/associations.js';
import router from './routes/router.js';

dotenv.config();
console.log('process.env.FRONTEND_URL', process.env.FRONTEND_URL)
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://scso0gcwswksoow80k004g8w.69.62.99.208.sslip.io',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

// Usar CORS com opções e habilitar preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});


