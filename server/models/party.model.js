import mongoose from 'mongoose'

const PartySchema = new mongoose.Schema({
  game: {type: mongoose.Schema.ObjectId, ref: 'Game'},
  updated: Date,
  joined: {
    type: Date,
    default: Date.now
  },
  player: {type: mongoose.Schema.ObjectId, ref: 'User'},
  missionStatus: [{
      mission: {type: mongoose.Schema.ObjectId, ref: 'Mission'}, 
      complete: Boolean}],
  completed: Date
})

export default mongoose.model('Party', PartySchema)
