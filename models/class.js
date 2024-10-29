import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  semestreIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'semester' }],
  carreraIds: { type: mongoose.Schema.Types.ObjectId, ref: 'career', required: true } // Añadir esta línea
}, { timestamps: true });

const Class = mongoose.model('class', classSchema);

export default Class;
