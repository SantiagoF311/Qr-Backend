import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  classes: [{
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    semesters: [{ type: Number }]  // Lista de semestres asociados a la clase
  }]
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);

export default Career;
