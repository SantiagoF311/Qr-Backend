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

// Configuración de CORS para Express
app.use(cors({
  origin: 'http://qr-backend-oxm9.onrender.com',  // Permite cualquier origen (ajustar según necesidad de seguridad)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // Añadir headers que necesites
  credentials: true,  // Permite el uso de credenciales como cookies
}));

// Configuración de Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: 'https://qr-backend-oxm9.onrender.com',  // Especifica el origen correcto del cliente
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

let accumulatedData = ''; 

port.on('open', () => {
  console.log('Puerto abierto');
});

// El manejador de 'data' ahora maneja los datos reales leídos del lector RFID
port.on('data', async (data) => {  
  accumulatedData += data.toString('utf-8');  // Acumula los datos leídos
  console.log('Datos acumulados:', accumulatedData);

  // Verificar si los datos contienen un salto de línea (indicación de fin de lectura)
  if (accumulatedData.includes('\n')) {
    // Limpiar espacios y saltos de línea extra
    let uid = accumulatedData.trim();

    // Solo procesamos si el UID tiene el formato correcto (eliminamos cualquier texto previo no deseado)
    const uidPattern = /^[A-F0-9\s]+$/;

    // Si el UID no es válido, limpiamos los datos y no procesamos nada
    if (!uidPattern.test(uid)) {
      console.log('Esperando datos válidos...');
      accumulatedData = '';  // Limpiar los datos acumulados y esperar una nueva lectura
      return;  // No hacer nada más hasta que tengamos un UID válido
    }

    console.log('UID recibido:', uid);

    // Si es un UID válido, procesarlo
    const extractedUID = uid;

    try {
      // Realizar la llamada al controlador para obtener los datos del estudiante
      const response = await axios.post('http://qr-backend-oxm9.onrender.com/api/students/uid', {
        cardUID: extractedUID,
      });

      console.log('Respuesta del controlador:', response.data);

      // Emitir el UID o los datos del estudiante al cliente
      io.emit('uidReceived', response.data);  // Emitir los datos al cliente

    } catch (error) {
      console.error('Error al enviar el UID al controlador:', error.response ? error.response.data : error.message);
    }

    // Limpiar los datos acumulados después de procesarlos
    accumulatedData = ''; 
  }
});

port.on('error', (err) => {
  console.log('Error: ', err);
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
      const uid = accumulatedData.trim(); // Obtenemos el UID limpio
      console.log('UID recibido:', uid);

      // Solo procesamos si el UID es válido
      const uidPattern = /^[A-F0-9\s]+$/;
      if (uidPattern.test(uid)) {
        // Emitimos el UID al cliente
        socket.emit('uidReceived', { cardUID: uid });
        console.log('UID enviado al cliente:', uid);
        accumulatedData = ''; // Limpiar datos acumulados después de enviarlo
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
