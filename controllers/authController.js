import User from '../models/person/person.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode'; 

export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crea el nuevo admin
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin', // Asegúrate de establecer el rol como 'admin'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registrado con éxito' });
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
      const hashedPassword = await bcrypt.hash(password, 10);
      
      let qrCode = null; // Inicializa qrCode como null
  
      // Genera el código QR solo si el rol es 'estudiante'
      if (role === 'estudiante') {
        const qrCodeData = `Username: ${username}, Email: ${email}`; // Aquí puedes personalizar la información que se codificará
        qrCode = await QRCode.toDataURL(qrCodeData); // Genera el QR como Data URL
      }
  
      // Crea el nuevo usuario
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
        qrCode, // Guarda el QR en el modelo (será null si no se generó)
      });
  
      await newUser.save();
      res.status(201).json({ message: 'Usuario registrado con éxito', qrCode });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
