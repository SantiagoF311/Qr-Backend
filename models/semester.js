import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  number: { type: Number, required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });

const Semester = mongoose.model('Semester', semesterSchema);

export default Semester;
