// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from './models/person/person.js';

export const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o formato incorrecto' });
  }

  const actualToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token ha expirado' });
    }
    return res.status(403).json({ error: 'Token inválido' });
  }
};


export const isAdmin = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Requiere permisos de administrador.' });
  }

  next();
};
