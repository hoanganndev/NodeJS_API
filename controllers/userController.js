const User = require('../models/userModel');
const Deck = require('../models/deckModel');
const JWT = require('jsonwebtoken');
const {JWT_SECRET}=require('../configs/index');
/*
  *iss: tên người tạo
  *sub:lấy userId để encode
  *iat: ngày khởi tạo là ngày hiện tại
  *exp: thời gian hết hạn trong 1 ngày
  *scret: NodeJsApiAuthentication
*/
const encodedToken = (userId) => {
  return JWT.sign({
    iss: "Hoang An",
    sub: userId,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getTime() + 1)
  }, JWT_SECRET)
}
const index = async (req, res, next) => {
  // try {
  // } catch (error) {
  //     next(error);FIXME: express-promise-router tự động bắt lỗi ở catch và chuyển sang app.js để xử lý
  // }
  const users = await User.find({})
  //throw new Error('check lỗi ở app.js hoạt động thế nào ');
  return res.status(200).json({ users });
}
const getUser = async (req, res, next) => {
  //req.value.params đã được validate ở routehelper.js
  const { userId } = req.value.params;
  const user = await User.findById(userId);
  return res.status(200).json({ user });
}
const newUser = async (req, res, next) => {
  //req.value.body đã được validate ở routehelper.js
  const newUser = new User(req.value.body);
  await newUser.save();
  return res.status(201).json({ user: newUser });
}
const replaceUser = async (req, res, next) => {
  //replace all
  const { userId } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userId, newUser);
  return res.status(200).json({ success: true })
}
const updateUser = async (req, res, next) => {
  //replace item
  const { userId } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userId, newUser);
  return res.status(200).json({ success: true })
}
const getUserDeck = async (req, res, next) => {
  //get all deck from user
  const { userId } = req.value.params;
  //get user
  const user = await User.findById(userId).populate('decks');
  return res.status(200).json({ decks: user.decks })
}
const newUserDeck = async (req, res, next) => {
  const { userId } = req.value.params;
  //create new deck
  const newDeck = new Deck(req.value.body);
  //get user
  const user = await User.findById(userId);
  //assign user as a deck's owner
  newDeck.owner = user
  //save the deck
  await newDeck.save();
  //add deck to user's  decks  array 'decks'
  user.decks.push(newDeck._id);
  //save the user
  await user.save();
  res.status(201).json({ deck: newDeck });

}
const secret = async (req, res, next) => {
}
const singIn = async (req, res, next) => {
}
const signUp = async (req, res, next) => {
  console.log('🔥',JWT_SECRET)
  // console.log('🔥=>signUp req.value.body', req.value.body);
  const { firstName, lastName, email, password } = req.value.body;
  //Check if there is a user the same user
  const foundUser = await User.findOne({ email })
  // console.log('🔥=>foundUser', foundUser);
  if (foundUser) return res.status(403).json({ error: { message: "Email is already in user" } })
  //Create a new user
  const newUser = new User({ firstName, lastName, email, password });
  // console.log('🔥=>newUser', newUser);
  await newUser.save();
  //Encode a token
  const token =encodedToken(newUser._id);
  //cach 1: return res.status(201).json({ success: true ,token});
  // trả token thông qua header
  res.setHeader('Authorization', token);
  return res.status(201).json({ success: true});




}

module.exports = {
  index,
  getUser,
  getUserDeck,
  newUser,
  newUserDeck,
  replaceUser,
  updateUser,
  secret,
  singIn,
  signUp
}

