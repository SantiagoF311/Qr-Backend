import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  semesterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Semester' }],
  career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true }
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

export default Class;
