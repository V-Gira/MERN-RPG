import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    trim: true,
  },
  system: {
    type: String,
    required: 'System is required',
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  player: { type: mongoose.Schema.ObjectId, ref: 'User' },
});

export default mongoose.model('Character', CharacterSchema);
