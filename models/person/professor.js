import mongoose from 'mongoose';
import Person from './person.js';

const professorSchema = new mongoose.Schema({
  careers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Career' }],
  classes: [{
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    semester: Number
  }]
});

const Professor = Person.discriminator('Professor', professorSchema);
export default Professor;
