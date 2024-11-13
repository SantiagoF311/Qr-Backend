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
  const { username, email, password, role, uid } = req.body; // Recibe el uid

  console.log("Datos recibidos en el registro:", req.body); // Verificar datos recibidos en el backend

  if (!['student', 'admin', 'professor'].includes(role)) {
    console.log("Error: Rol no válido", role);
    return res.status(400).json({ message: 'Rol no válido' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Error: El correo ya está registrado", email);
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Verificar si el UID de la tarjeta ya está en uso
    if (role === 'student') {
      console.log("Verificando si el UID ya está en uso:", uid);
      const existingUID = await Student.findOne({ uid: uid });  // Aquí cambiamos cardUID a uid
      if (existingUID) {
        console.log("Error: El UID ya está asignado a otro estudiante:", uid);
        return res.status(400).json({ message: 'El UID de la tarjeta ya está asignado a otro estudiante' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Contraseña hasheada:", hashedPassword);

    let newUser;
    if (role === 'student') {
      // Crea el estudiante con el UID proporcionado
      newUser = new Student({
        username,
        email,
        password: hashedPassword,
        role,
        uid: uid,  
      });

      // Guarda el estudiante en la base de datos
      await newUser.save();

      // Genera el código QR usando el ID del estudiante
      const qrCodeData = newUser._id.toString();
      const qrCode = await QRCode.toDataURL(qrCodeData);

      // Actualiza el estudiante con el código QR generado
      newUser.qrCode = qrCode;
      await newUser.save();

    } else if (role === 'professor') {
      newUser = new Professor({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();
    } else {
      newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();
    }

    // Respuesta con el QR si es un estudiante
    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser._id,
        uid: newUser.uid,  
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        qrCode: newUser.qrCode || null,  
      },
    });
    
  } catch (error) {
    console.error('Error en el registro:', error); // Mostrar error detallado
    return res.status(500).json({ message: `Error en el registro: ${error.message}` });
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
        uid: user.uid,  
        username: user.username,
        email: user.email,
        role: user.role,
        qrCode, 
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
