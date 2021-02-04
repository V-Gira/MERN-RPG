import Game from '../models/game.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let game = new Game(fields)
    game.instructor= req.profile
    if(files.image){
      game.image.data = fs.readFileSync(files.image.path)
      game.image.contentType = files.image.type
    }
    try {
      let result = await game.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**
 * Load game and append to req.
 */
const gameByID = async (req, res, next, id) => {
  try {
    let game = await Game.findById(id).populate('instructor', '_id name')
    if (!game)
      return res.status('400').json({
        error: "Game not found"
      })
    req.game = game
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve game"
    })
  }
}

const read = (req, res) => {
  req.game.image = undefined
  return res.json(req.game)
}

const list = async (req, res) => {
  try {
    let games = await Game.find().select('name email updated created')
    res.json(games)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let game = req.game
    game = extend(game, fields)
    if(fields.missions){
      game.missions = JSON.parse(fields.missions)
    }
    game.updated = Date.now()
    if(files.image){
      game.image.data = fs.readFileSync(files.image.path)
      game.image.contentType = files.image.type
    }
    try {
      await game.save()
      res.json(game)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const newMission = async (req, res) => {
  try {
    let mission = req.body.mission
    let result = await Game.findByIdAndUpdate(req.game._id, {$push: {missions: mission}, updated: Date.now()}, {new: true})
                            .populate('instructor', '_id name')
                            .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let game = req.game
    let deleteGame = await game.remove()
    res.json(deleteGame)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isInstructor = (req, res, next) => {
    const isInstructor = req.game && req.auth && req.game.instructor._id == req.auth._id
    if(!isInstructor){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

const listByInstructor = (req, res) => {
  Game.find({instructor: req.profile._id}, (err, games) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(games)
  }).populate('instructor', '_id name')
}

const listPublished = (req, res) => {
  Game.find({published: true}, (err, games) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(games)
  }).populate('instructor', '_id name')
}

const photo = (req, res, next) => {
  if(req.game.image.data){
    res.set("Content-Type", req.game.image.contentType)
    return res.send(req.game.image.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultImage)
}


export default {
  create,
  gameByID,
  read,
  list,
  remove,
  update,
  isInstructor,
  listByInstructor,
  photo,
  defaultPhoto,
  newMission,
  listPublished
}
