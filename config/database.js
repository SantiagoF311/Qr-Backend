import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

export default mongoose;
