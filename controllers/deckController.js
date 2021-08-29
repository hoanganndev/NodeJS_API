const User = require('../models/userModel');
const Deck = require('../models/deckModel');

const index = async (req, res, next) => {
  const decks = await Deck.find({});
  return res.status(200).json({ decks });
}
const newDeck = async (req, res, next) => {
  //Find owner
  const ownerUser = await User.findById(req.value.body.owner);
  //Create a new deck
  const deck = req.value.body;
  delete deck.owner;
  deck.owner = ownerUser._id;
  const newDeck = new Deck(deck);
  await newDeck.save();
  //Add newly  created  deck to actual  decks
  ownerUser.decks.push(newDeck._id);
  await ownerUser.save();
  return res.status(201).json({ deck: newDeck });

}
const getDeck = async (req, res, next) => {
  const deck = await Deck.findById(req.value.params.deckId);
  return res.status(200).json({ deck });
}
const replaceDeck = async (req, res, next) => {
  const { deckId } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckId, newDeck);
  console.log('🔥', result);
  //FIXME: Check if put user, remove deck in user's model
  return res.status(200).json({ success: true });
}
const updateDeck = async (req, res, next) => {
  const { deckId } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckId, newDeck);
  // console.log('🔥',result);
  //FIXME: Check if put user, remove deck in user's model
  return res.status(200).json({ success: true });
}
const deleteDeck = async (req, res, next) => {
  const { deckId } = req.value.params;
  //Get a deck
  const deck = await Deck.findById(deckId);
  const ownerId = deck.owner;
  //Get a owner
  const owner = await User.findById(ownerId);
  //Remove the deck
  console.log('🔥deck', deck);
  await deck.remove();
  //Remove deck from owner's decks list
  owner.decks.pull(deck);
  await owner.save();
  return res.status(200).json({ success: true });
}
module.exports = {
  index,
  newDeck,
  getDeck,
  replaceDeck,
  updateDeck,
  deleteDeck
}

