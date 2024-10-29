// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from './models/person/person.js';

export const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
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
