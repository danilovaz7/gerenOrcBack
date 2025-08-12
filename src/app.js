import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import './models/associations.js';
import router from './routes/router.js';

dotenv.config();
console.log('process.env.FRONTEND_URL', process.env.FRONTEND_URL)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

const app = express();


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});


