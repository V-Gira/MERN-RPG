import mongoose from 'mongoose'

const MissionSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String
})
const Mission = mongoose.model('Mission', MissionSchema)
const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: 'Category is required'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  gameMaster: {type: mongoose.Schema.ObjectId, ref: 'User'},
  published: {
    type: Boolean,
    default: false
  },
  missions: [MissionSchema]
})

export default mongoose.model('Game', GameSchema)
