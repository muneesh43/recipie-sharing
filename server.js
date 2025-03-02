// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');
dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // For parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error: ", err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to RecipeShare API!');
});

// Route to submit a recipe
app.post('/api/recipes', async (req, res) => {
  const { name, ingredients, instructions, image } = req.body;

  if (!name || !ingredients || !instructions || !image) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const newRecipe = new Recipe({ name, ingredients, instructions, image });
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe submitted successfully!', recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ message: 'Server error while saving the recipe.' });
  }
});

// Route to handle contact form submission (for demonstration purposes)
app.post('/api/contact', (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  // In real-world, you might send an email or store it in a database
  console.log(`Contact received from ${email}: ${message}`);
  res.status(200).json({ message: 'Thank you for contacting us! We will get back to you shortly.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
