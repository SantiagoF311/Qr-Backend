import express from 'express';
import connectToDatabase from './config/database.js';
import userRoutes from './routes/person/personRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/careers', careerRoutes);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
