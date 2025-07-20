const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'YOUR_SECRET_KEY';

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfolioApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Register route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, passwordHash });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, userId: user._id });
});

// Get student profile
app.get('/api/students/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('profile');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.profile);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
