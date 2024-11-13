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
import axios from 'axios'; // Asegúrate de importar axios
import http from 'http'; // Importar http para crear un servidor HTTP
import { Server } from 'socket.io'; // Cambiado para usar Server de socket.io

dotenv.config();

const app = express();
const server = http.createServer(app); // Usamos un servidor HTTP
const io = new Server(server); // Inicializamos Socket.io con el servidor

const PORT = process.env.PORT || 3000;

const port = new SerialPort({
  path: 'COM3',  
  baudRate: 9600,
});

let accumulatedData = ''; 

port.on('open', () => {
  console.log('Puerto abierto');
});

// Cambiar el manejador de 'data' a una función 'async'
port.on('data', async (data) => {  
  accumulatedData += data.toString('utf-8');  
  console.log('Datos acumulados:', accumulatedData);

  if (accumulatedData.includes('\n')) {
    const uid = accumulatedData.trim();  
    console.log('UID recibido:', uid);

    const extractedUID = uid;  

    try {
      const response = await axios.post('https://qr-backend-oxm9.onrender.com/api/students/card/uid', {
        cardUID: extractedUID,
      });

      console.log('Respuesta del controlador:', response.data); 

      // Emitir el UID o los datos del estudiante según la respuesta
      io.emit('uidReceived', response.data);  

    } catch (error) {
      console.error('Error al enviar el UID al controlador:', error.response ? error.response.data : error.message);
    }

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

// Ruta raíz que devuelve "Inicio"
app.get('/', (req, res) => {
  res.status(200).send('<h1>Inicio</h1>');
});

// Inicia la conexión de socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  // Aquí puedes manejar eventos del cliente, por ejemplo:
  socket.on('startReadingCard', () => {
    console.log('Cliente solicitó comenzar la lectura de tarjeta');
    // Puedes emitir un evento para iniciar la lectura de la tarjeta, si es necesario
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor con manejo de errores
try {
  connectToDatabase().then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error.message);
}
