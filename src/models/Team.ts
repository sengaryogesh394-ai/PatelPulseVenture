import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  bio: {
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
  socialLinks: {
    linkedin: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    github: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes for better performance
TeamSchema.index({ id: 1 });
TeamSchema.index({ status: 1 });
TeamSchema.index({ order: 1 });
TeamSchema.index({ name: 1 });

// Force delete cached model to ensure schema updates are applied
if (mongoose.models.Team) {
  delete mongoose.models.Team;
}

const Team = mongoose.model('Team', TeamSchema);

export default Team;
