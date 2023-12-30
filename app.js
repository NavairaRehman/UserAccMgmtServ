// app.js

const express = require('express'); // import express
const connectToDatabase = require('.src/db/connect'); // import the connect function
const userRoutes = require('./src/routes/userRoutes'); // import the user routes

const app = express(); // create an express app
const PORT = process.env.PORT || 3000; 

connectToDatabase(); 

//Define the API routes 
app.use('/users', userRoutes);

//Start the server
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
}); 