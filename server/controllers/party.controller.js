import Party from '../models/party.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
  let newParty = {
    game: req.game,
    player: req.auth,
  }
  newParty.missionStatus = req.game.missions.map((mission)=>{
    return {mission: mission, complete:false}
  })
  const party = new Party(newParty)
  try {
    let result = await party.save()
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load party and append to req.
 */
const partyByID = async (req, res, next, id) => {
  try {
    let party = await Party.findById(id)
                                    .populate({path: 'game', populate:{ path: 'gameMaster'}})
                                    .populate('player', '_id name')
    if (!party)
      return res.status('400').json({
        error: "Party not found"
      })
    req.party = party
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve party"
    })
  }
}

const read = (req, res) => {
  return res.json(req.party)
}

const complete = async (req, res) => {
  let updatedData = {}
  updatedData['missionStatus.$.complete']= req.body.complete 
  updatedData.updated = Date.now()
  if(req.body.gameCompleted)
    updatedData.completed = req.body.gameCompleted

    try {
      let party = await Party.updateOne({'missionStatus._id':req.body.missionStatusId}, {'$set': updatedData})
      res.json(party)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let party = req.party
    let deletedParty = await party.remove()
    res.json(deletedParty)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isPlayer = (req, res, next) => {
  const isPlayer = req.auth && req.auth._id == req.party.player._id
  if (!isPlayer) {
    return res.status('403').json({
      error: "User is not enrolled"
    })
  }
  next()
}

const listEnrolled = async (req, res) => {
  try {
    let parties = await Party.find({player: req.auth._id}).sort({'completed': 1}).populate('game', '_id name category')
    res.json(parties)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const findParty = async (req, res, next) => {
  try {
    let parties = await Party.find({game:req.game._id, player: req.auth._id})
    if(parties.length == 0){
      next()
    }else{
      res.json(parties[0])
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const partyStats = async (req, res) => {
  try {
    let stats = {}
    stats.totalEnrolled = await Party.find({game:req.game._id}).countDocuments()
    stats.totalCompleted = await Party.find({game:req.game._id}).exists('completed', true).countDocuments()
      res.json(stats)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
} 

export default {
  create,
  partyByID,
  read,
  remove,
  complete,
  isPlayer,
  listEnrolled,
  findParty,
  partyStats
}
