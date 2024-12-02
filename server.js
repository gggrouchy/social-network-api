const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes); // Prefix for API routes

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Social Network API!');
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

