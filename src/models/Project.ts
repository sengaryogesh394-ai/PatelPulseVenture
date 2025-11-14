import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  technologies: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  cloudinaryPublicId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Create indexes for better performance
ProjectSchema.index({ id: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ title: 1 });

// Force delete cached model to ensure schema updates are applied
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
