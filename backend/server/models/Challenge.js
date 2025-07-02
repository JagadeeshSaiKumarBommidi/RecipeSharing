import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    default: '🏆'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  prize: {
    type: String,
    default: 'Recognition and Badge'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  rules: [{
    type: String
  }],
  hashtags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Virtual for participant count
challengeSchema.virtual('participantsCount').get(function() {
  return this.participants.length;
});

// Ensure virtual fields are serialized
challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

export default mongoose.model('Challenge', challengeSchema);
