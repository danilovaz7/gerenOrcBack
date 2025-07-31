import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'admclinicaleutz@gmail.com', 
    pass: 'qhmi ninj bmva frpc', 
  },
});

export default transporter;