import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import gameCtrl from '../controllers/game.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)

router.route('/api/enrollment/new/:gameId')
  .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)  

router.route('/api/enrollment/stats/:gameId')
  .get(enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/complete/:enrollmentId')
  .put(authCtrl.requireSignin, enrollmentCtrl.isPlayer, enrollmentCtrl.complete) 

router.route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignin, enrollmentCtrl.isPlayer, enrollmentCtrl.read)
  .delete(authCtrl.requireSignin, enrollmentCtrl.isPlayer, enrollmentCtrl.remove)

router.param('gameId', gameCtrl.gameByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router
