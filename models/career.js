import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  clases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'class' }],
}, { timestamps: true });

const Career = mongoose.model('career', careerSchema);

export default Career;
