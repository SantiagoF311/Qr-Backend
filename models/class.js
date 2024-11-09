import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  semesterIds: [{ type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] }], // Cambiado a números del 1 al 9
  careers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Career' }] // Cambiado para asociar múltiples carreras
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

export default Class;
