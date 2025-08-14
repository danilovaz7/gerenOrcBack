import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import './models/associations.js';
import router from './routes/router.js';

dotenv.config();
console.log('process.env.FRONTEND_URL', process.env.FRONTEND_URL)
const app = express();

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

const sts = new STSClient({ region: process.env.AWS_REGION, credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}});

const id = await sts.send(new GetCallerIdentityCommand({}));
console.log('caller identity:', id); // procure o ARN (user/role)


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://scso0gcwswksoow80k004g8w.69.62.99.208.sslip.io',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};
app.use((req, res, next) => {
  console.log('>>> REQ:', req.method, req.url, ' Origin:', req.headers.origin);
  next();
});

// Usar CORS com opções e habilitar preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});


