import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  carrera: { type: mongoose.Schema.Types.ObjectId, ref: 'career', required: true },
  numero: { type: Number, required: true },
  clases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'class' }], 
}, { timestamps: true });

const Semester = mongoose.model('semester', semesterSchema);

export default Semester;
