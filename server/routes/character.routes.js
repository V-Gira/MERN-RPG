import express from 'express';
import characterCtrl from '../controllers/character.controller';
import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router
  .route('/api/characters/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, characterCtrl.create)
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    characterCtrl.listByUser
  );

router
  .route('/api/characters/photo/:characterId')
  .get(characterCtrl.photo, characterCtrl.defaultPhoto);

router.route('/api/characters/defaultphoto').get(characterCtrl.defaultPhoto);

router
  .route('/api/characters/:characterId')
  .get(characterCtrl.read)
  .put(authCtrl.requireSignin, characterCtrl.update)
  .delete(authCtrl.requireSignin, characterCtrl.remove);

router.param('characterId', characterCtrl.characterByID);
router.param('userId', userCtrl.userByID);

export default router;
