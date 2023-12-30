// app.js

const express = require('express'); // import express
const bodyParser = require('body-parser'); // import body-parser
const connectToDatabase = require('./src/db/connect'); // import the connect function
const userRoutes = require('./src/routes/userRoutes'); // import the user routes

const app = express(); // create an express app
const PORT = process.env.PORT || 3000; 

// Middleware for parsing JSON and URL-encoded form data using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDatabase(); 

// Simple route to test the connection
app.get('/', (req, res) => {
    res.send('Hello, the server is running!');
  });

//Define the API routes 
app.use('/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });