import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/database.js';
import userRoutes from './routes/person/personRoutes.js';
import professorRoutes from './routes/person/professorRoutes.js';
import studentRoutes from './routes/person/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import classRoutes from './routes/classRoutes.js';
import semesterRoutes from './routes/semesterRoutes.js';
import { SerialPort } from 'serialport';
import axios from 'axios';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Importar cors

dotenv.config();

const app = express();
const server = http.createServer(app);

// Para CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.240:3000'], // Agregar tu IP local
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.0.240:3000'], // Agregar tu IP local
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Configuración del puerto serial (ajusta el path si es necesario)
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
});

let accumulatedData = '';  // Almacenar los datos acumulados

port.on('open', () => {
  console.log('Puerto abierto');
});

port.on('data', async (data) => {
  accumulatedData += data.toString('utf-8'); // Acumula los datos leídos

  // Asegurarse de procesar solo cuando haya un salto de línea en los datos
  if (accumulatedData.includes('\n')) {
    let uid = accumulatedData.trim(); // Eliminar espacios y saltos de línea extra

    console.log('Datos acumulados antes de procesar:', uid);

    // Eliminar el prefijo "Card UID: " si está presente
    const cleanedUID = uid.replace(/^Card UID: /, '').trim();

    console.log('UID limpio después de eliminar prefijo:', cleanedUID);

    const uidPattern = /^[A-F0-9\s]+$/;

    if (!uidPattern.test(cleanedUID)) {
      console.log('Esperando datos válidos...'); // Log para ver qué está llegando
      accumulatedData = ''; // Limpiar los datos acumulados y esperar una nueva lectura
      return;
    }

    console.log('Datos recibidos:', cleanedUID);

    // Eliminar cualquier otro texto extra como espacios adicionales
    const extractedUID = cleanedUID.replace(/[^A-F0-9]/g, '').toUpperCase();

    console.log('UID extraído después de limpiar:', extractedUID);
    
    try {
      const response = await axios.post('http://localhost:3000/api/students/uid', {
        cardUID: extractedUID,
      });

      console.log('Respuesta del controlador:', response.data);
      
      // Emitir los datos al cliente
      io.emit('uidReceived', response.data); // Emitir los datos al cliente
    } catch (error) {
      console.error('Error al enviar el UID al controlador:', error.response ? error.response.data : error.message);
    }

    accumulatedData = '';
  }
});

port.on('error', (err) => {
  console.log('Error en el puerto:', err);
});

app.use(express.json());

// Rutas principales
app.use('/api/users', userRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/semesters', semesterRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).send('<h1>Inicio</h1>');
});

// Conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('startReadingCard', () => {
    console.log('Evento startReadingCard recibido');

    // Esperamos a que accumulatedData contenga un UID válido
    if (accumulatedData.trim()) {
      let uid = accumulatedData.trim(); // Obtenemos el UID limpio
      console.log('UID recibido:', uid);

      // Limpiar el prefijo y validar el UID
      const cleanedUID = uid.replace(/^Card UID: /, '').trim();
      const uidPattern = /^[A-F0-9\s]+$/;

      if (uidPattern.test(cleanedUID)) {
        // Eliminar caracteres no válidos
        const extractedUID = cleanedUID.replace(/[^A-F0-9]/g, '').toUpperCase();
        console.log('UID limpio enviado al cliente:', extractedUID);
        socket.emit('uidReceived', { cardUID: extractedUID });
        accumulatedData = ''; 
      } else {
        console.log('Esperando datos válidos...');
      }
    } else {
      console.log('Esperando datos válidos...');
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
try {
  connectToDatabase().then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error.message);
}
