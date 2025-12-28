import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#667eea' },
  icon: { type: String, default: 'folder' },
  description: { type: String },
  taskCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

categorySchema.index({ userId: 1, name: 1 });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
