import mongoose from 'mongoose';
import Person from './person.js';

const studentSchema = new mongoose.Schema({
  qrCode: { type: String },
  career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  attendance: { type: Boolean, default: false },
});

const Student = Person.discriminator('Student', studentSchema);
export default Student;
