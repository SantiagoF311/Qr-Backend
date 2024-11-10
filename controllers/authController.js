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
  
  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar código QR para el estudiante
    const qrCodeData = `Username: ${username}, Email: ${email}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);

    // Crear el estudiante sin la referencia a la carrera
    const newStudent = new Student({
      username,
      email,
      password: hashedPassword,
      role,
      qrCode  // Asignar el código QR generado
    });

    // Guardar en la base de datos
    await newStudent.save();

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newStudent._id,
        username: newStudent.username,
        email: newStudent.email,
        role: newStudent.role,
        qrCode: newStudent.qrCode  // Asegúrate de que el qrCode esté en la respuesta
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El correo o el nombre de usuario ya están en uso' });
    }

    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
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

    // Enviar los datos del usuario completo junto con el token
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        qrCode: user.qrCode, // Esto será null si el usuario no tiene un QR
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
