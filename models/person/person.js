import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'professor', 'admin'], required: true }, 
}, { timestamps: true });


const Person = mongoose.model('Person', personSchema);
export default Person;
