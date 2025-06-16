// authService.js
import jwt from 'jsonwebtoken';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const [, token] = header.split(" ")
  console.log(token)
  // Se não houver token, retorna 403
  if (!token) {
    return res.status(403).json({ message: "Forbidden", error: "Token is missing" });
  }

  try {
    // Verifica e decodifica o token JWT usando a chave secreta do ambiente
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Anexa o usuário decodificado à requisição
    req.user = decoded;
    next();
  } catch (error) {
    let errorMessage = "Unauthorized";
    let errorDetail = error.message;

    // Caso o token esteja expirado, personalizamos a mensagem
    if (error.name === 'TokenExpiredError') {
      errorMessage = "Token Expired";
      errorDetail = "The token has expired.";
    }

    return res.status(401).json({ message: errorMessage, error: errorDetail });
  }
}
