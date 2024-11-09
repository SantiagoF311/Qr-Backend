import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);

export default Career;
