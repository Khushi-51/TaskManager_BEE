import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  dueDate: { type: Date },
  category: { type: String },
  color: { type: String, default: '#667eea' },
  tags: [String],
  recurring: {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    nextDueDate: { type: Date },
  },
  subtasks: [{
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  isTemplate: { type: Boolean, default: false },
  templateName: { type: String },
  completedAt: { type: Date },
  estimatedHours: { type: Number },
  actualHours: { type: Number },
  attachments: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, isTemplate: 1 });
taskSchema.index({ userId: 1, recurring: 1 });
taskSchema.index({ createdAt: -1 });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
