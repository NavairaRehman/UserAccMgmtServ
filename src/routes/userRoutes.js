const express = require('express');
const router = express.Router();
const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const winston = require('winston'); // Import Winston for logging

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the minimum logging level
  format: winston.format.simple(), // Use a simple log format
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'userRoutes.log' }), // Log to a file
  ],
});

// Define your routes and middleware here

// User registration routes
router.get('/register', (req, res) => {
  res.send('User registration page');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    logger.info('Received registration request:', { username, email, fullName });

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      logger.warn('User already exists:', { username, email });
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password, fullName });
    await newUser.save();

    logger.info('User created successfully:', { username, email });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    logger.error('Error during user registration:', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login routes
router.get('/login', (req, res) => {
  res.send('User login page');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    logger.info('Received login request:', { username });

    const user = await User.findOne({ username });

    if (!user) {
      logger.warn('User does not exist:', { username });
      return res.status(400).json({ message: 'User does not exist' });
    }

    if (password !== user.password) {
      logger.warn('Incorrect password:', { username });
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Create a JSON Web Token if username and password are correct
    // const token = jwt.sign({ username }, 'secret', { expiresIn: '24h' });

    logger.info('User logged in successfully:', { username });
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    logger.error('Error during user login:', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//User profile management routes

//get user profile
route.get('/profile', (req, res) => {
    router.get('/profile', async (req, res) => {
        try{
            //fetch user profile from the database
            const userProfile = await User.findOne({username: req.user.username});

            if (!userProfile){
                return res.status(404).json({message: 'User profile not found'});
            }

            //send the user profile to the user
            res.status(200).json({userProfile}); //replace this with your user profile page HTML file
        } catch(error){
            console.error('Error fetching user profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

// Route to update user profile information
router.put('/profile', async (req, res) => {
    try {
      const { _id, username, email, fullName, bio, profilePicture } = req.body;
  
      // Build the update object based on the fields provided in the request body
      const updateObject = {};
      if (fullName) updateObject.fullName = fullName;
      if (bio) updateObject.bio = bio;
      if (profilePicture) updateObject.profilePicture = profilePicture;
      if (email) updateObject.email = email;
      if (username) updateObject.username = username;

  
      // Update user profile information in the database
      const updatedProfile = await User.findByIdAndUpdate(
        _id,
        { $set: updateObject }, // Using $set to update only specified fields
        { new: true } // Return the updated document
      );
  
      if (!updatedProfile) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      // Respond with the updated user profile information
      res.status(200).json(updatedProfile); // replace this with your user profile page HTML file
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to delete user profile
router.delete('/profile', async (req, res) => {
    try {
      const {username, _id} = req.body;
  
      // Delete user profile information from the database
      const deletedProfile = await User.findByIdAndDelete(_id);
  
      if (!deletedProfile) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      // Respond with a success message or additional information as needed
      res.status(200).json({ message: 'User profile deleted successfully' }); 
    } catch (error) {
      console.error('Error deleting user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  //change user password
  router.put('/change-password', async (req, res) => {
    try {
      const { username, email, currentPassword, newPassword } = req.body;
  
      // Determine which field (username or email) was provided
      const userField = username ? 'username' : 'email';
      const userValue = username || email;
  
      // Find the user in the database
      const user = await User.findOne({ [userField]: userValue });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Verify the current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid current password' });
      }
  
      // Update the password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      // Respond with a success message
      res.status(200).json({ message: 'Password changed successfully' }); //show this message on the user profile page
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;
