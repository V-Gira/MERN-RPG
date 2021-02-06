import Enrollment from '../models/enrollment.model'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  let newEnrollment = {
    game: req.game,
    player: req.auth,
  }
  newEnrollment.missionStatus = req.game.missions.map((mission)=>{
    return {mission: mission, complete:false}
  })
  const enrollment = new Enrollment(newEnrollment)
  try {
    let result = await enrollment.save()
    return res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load enrollment and append to req.
 */
const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
                                    .populate({path: 'game', populate:{ path: 'instructor'}})
                                    .populate('player', '_id name')
    if (!enrollment)
      return res.status('400').json({
        error: "Enrollment not found"
      })
    req.enrollment = enrollment
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve enrollment"
    })
  }
}

const read = (req, res) => {
  return res.json(req.enrollment)
}

const complete = async (req, res) => {
  let updatedData = {}
  updatedData['missionStatus.$.complete']= req.body.complete 
  updatedData.updated = Date.now()
  if(req.body.gameCompleted)
    updatedData.completed = req.body.gameCompleted

    try {
      let enrollment = await Enrollment.updateOne({'missionStatus._id':req.body.missionStatusId}, {'$set': updatedData})
      res.json(enrollment)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let enrollment = req.enrollment
    let deletedEnrollment = await enrollment.remove()
    res.json(deletedEnrollment)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isPlayer = (req, res, next) => {
  const isPlayer = req.auth && req.auth._id == req.enrollment.player._id
  if (!isPlayer) {
    return res.status('403').json({
      error: "User is not enrolled"
    })
  }
  next()
}

const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({player: req.auth._id}).sort({'completed': 1}).populate('game', '_id name category')
    res.json(enrollments)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({game:req.game._id, player: req.auth._id})
    if(enrollments.length == 0){
      next()
    }else{
      res.json(enrollments[0])
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const enrollmentStats = async (req, res) => {
  try {
    let stats = {}
    stats.totalEnrolled = await Enrollment.find({game:req.game._id}).countDocuments()
    stats.totalCompleted = await Enrollment.find({game:req.game._id}).exists('completed', true).countDocuments()
      res.json(stats)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
} 

export default {
  create,
  enrollmentByID,
  read,
  remove,
  complete,
  isPlayer,
  listEnrolled,
  findEnrollment,
  enrollmentStats
}
