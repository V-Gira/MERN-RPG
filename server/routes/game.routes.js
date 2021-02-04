import express from 'express'
import gameCtrl from '../controllers/game.controller'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/games/published')
  .get(gameCtrl.listPublished)

router.route('/api/games/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isGm, gameCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, gameCtrl.listByInstructor)

router.route('/api/games/photo/:gameId')
  .get(gameCtrl.photo, gameCtrl.defaultPhoto)

router.route('/api/games/defaultphoto')
  .get(gameCtrl.defaultPhoto)

router.route('/api/games/:gameId/mission/new')
  .put(authCtrl.requireSignin, gameCtrl.isInstructor, gameCtrl.newMission)

router.route('/api/games/:gameId')
  .get(gameCtrl.read)
  .put(authCtrl.requireSignin, gameCtrl.isInstructor, gameCtrl.update)
  .delete(authCtrl.requireSignin, gameCtrl.isInstructor, gameCtrl.remove)

router.param('gameId', gameCtrl.gameByID)
router.param('userId', userCtrl.userByID)

export default router
