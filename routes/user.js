const express = require('express');
const router = require("express-promise-router")();
//const router=express.Router();
const UserController = require('../controllers/userController');
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers');
const passport = require('passport');
const passportConfig=require('../middlewares/passport')

router.route('/')
  .get(UserController.index)
  .post(validateBody(schemas.userSchema), UserController.newUser)
//FIXME: SIGN UP, SIGN IN, SECRET
router.route('/signup')
  .post(validateBody(schemas.authSignUpSchema),UserController.signUp)
router.route('/signin')
  .post(validateBody(schemas.authSignInSchema),passport.authenticate('local',{session:false}), UserController.singIn)
router.route('/secret')
  .get(passport.authenticate('jwt', { session: false }),UserController.secret)
//FIXME: /:USER ID
router.route('/:userId')
  .get(validateParam(schemas.idSchema, 'userId'), UserController.getUser)
  .put(validateParam(schemas.idSchema, 'userId'), validateBody(schemas.userSchema), UserController.replaceUser)
  .patch(validateParam(schemas.idSchema, 'userId'), validateBody(schemas.userOptionalSchema), UserController.updateUser)
//FIXME: /:USERID/DECK
router.route('/:userId/decks')
  .get(validateParam(schemas.idSchema, 'userId'), UserController.getUserDeck)
  .post(validateParam(schemas.idSchema, 'userId'), validateBody(schemas.deckSchema), UserController.newUserDeck)

module.exports = router;
