import express from 'express'
import partyCtrl from '../controllers/party.controller'
import gameCtrl from '../controllers/game.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/party/joined')
  .get(authCtrl.requireSignin, partyCtrl.listJoined)

router.route('/api/party/new/:gameId')
  .post(authCtrl.requireSignin, partyCtrl.findParty, partyCtrl.create)  

router.route('/api/party/stats/:gameId')
  .get(partyCtrl.partyStats)

router.route('/api/party/complete/:partyId')
  .put(authCtrl.requireSignin, partyCtrl.isPlayer, partyCtrl.complete) 

router.route('/api/party/:partyId')
  .get(authCtrl.requireSignin, partyCtrl.isPlayer, partyCtrl.read)
  .delete(authCtrl.requireSignin, partyCtrl.isPlayer, partyCtrl.remove)

router.param('gameId', gameCtrl.gameByID)
router.param('partyId', partyCtrl.partyByID)

export default router
