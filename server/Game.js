const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  board: { type: [[Number]], required: true },
  goalBoard: { type: [[Number]], required: true },
  moveCount: { type: Number, required: true },
  elapsed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
