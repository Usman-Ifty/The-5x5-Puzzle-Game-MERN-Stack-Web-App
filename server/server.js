const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Game = require('./Game');
const app = express();
const PORT = 5000;

// Replace with your MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/puzzle'; // or your Atlas URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Puzzle Game API running!');
});

// Save game state
app.post('/api/save', async (req, res) => {
  try {
    const { board, goalBoard, moveCount, elapsed } = req.body;
    const game = new Game({ board, goalBoard, moveCount, elapsed });
    await game.save();
    res.json({ success: true, id: game._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Load latest game state
app.get('/api/load', async (req, res) => {
  try {
    const game = await Game.findOne().sort({ createdAt: -1 });
    if (!game) return res.status(404).json({ success: false, error: 'No saved game found' });
    res.json({ success: true, game });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
