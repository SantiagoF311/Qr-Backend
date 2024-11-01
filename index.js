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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
