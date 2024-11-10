import User from '../models/person/person.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode'; 
import Student from '../models/person/student.js';
import Professor from '../models/person/professor.js';

export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crea el nuevo admin
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin', 
    });

    await newAdmin.save();

    // Devuelve todos los datos del administrador recién creado
    res.status(201).json({
      message: 'Admin registrado con éxito',
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El correo o el nombre de usuario ya están en uso' });
    }

    console.error('Error al registrar admin:', error);
    res.status(500).json({ error: 'Error al registrar admin' });
  }
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!['student', 'admin', 'professor'].includes(role)) {
    return res.status(400).json({ message: 'Rol no válido' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'student') {
      // Generar el código QR con el ID, nombre de usuario y correo electrónico
      const qrCodeData = `ID: ${username}-${email}-${newUser._id}`;  // Usamos ID, username y email
      const qrCode = await QRCode.toDataURL(qrCodeData);

      newUser = new Student({
        username,
        email,
        password: hashedPassword,
        role,
        qrCode, // Asigna el QR al estudiante
      });
    } else if (role === 'professor') {
      newUser = new Professor({
        username,
        email,
        password: hashedPassword,
        role,
      });
    } else {
      newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
    }

    await newUser.save();

    // Respuesta con el QR si es un estudiante
    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        qrCode: newUser.qrCode || null, // Incluye el QR si existe
      },
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error en el registro' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Genera el token incluyendo el rol del usuario en el payload si es necesario
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Verificar si el usuario es un estudiante y tiene un QR
    let qrCode = null;
    if (user.role === 'student' && user.qrCode) {
      qrCode = user.qrCode;
    }

    // Enviar los datos del usuario completo junto con el token
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        qrCode, // Incluir el QR si es un estudiante
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
