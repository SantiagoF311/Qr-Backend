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

dotenv.config();

const app = express();
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
port.on('data', async (data) => {  // Marcar como 'async'
  // Concatenar los datos recibidos en una sola línea
  accumulatedData += data.toString('utf-8');  
  console.log('Datos acumulados:', accumulatedData);

  // Si los datos están completos y el formato esperado es un UID, procesarlos
  if (accumulatedData.includes('\n')) {
    const uid = accumulatedData.trim();  // Asegúrate de que los datos estén limpios

    console.log('UID recibido:', uid);

    // Verificar si el UID tiene el formato esperado
    if (uid.startsWith('UID de la tarjeta:')) {
      const extractedUID = uid.split(':')[1].trim();

      try {
        // Enviar el UID al controlador a través de una solicitud HTTP interna
        const response = await axios.post('http://localhost:3000/api/students/card/uid', {
          cardUID: extractedUID,
        });

        console.log('Respuesta del controlador:', response.data);
      } catch (error) {
        console.error('Error al enviar el UID al controlador:', error.response ? error.response.data : error.message);
      }
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

// Ruta raíz que devuelve "Inicio"
app.get('/', (req, res) => {
  res.status(200).send('<h1>Inicio</h1>');
});

// Iniciar el servidor con manejo de errores
try {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error.message);
}
