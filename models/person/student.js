import mongoose from 'mongoose';
import Person from './person.js';

const studentSchema = new mongoose.Schema({
  qrCode: { type: String },
  uid: { type: String, unique: true, required: true }, 
  career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  attendance: { type: Boolean, default: false },
});

// Crear el modelo de estudiante basado en el esquema con el campo UID
const Student = Person.discriminator('Student', studentSchema);

export default Student;
