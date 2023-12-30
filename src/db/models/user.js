//src/db/models/user.js

const {Schema, model} = require('mongoose'); // import mongoose

// create a schema
const userSchema = new Schema({
    username: {type: String, unique:true, required:true},
    password: {type: String, required:true},
    email: {type: String, unique:true, required:true},

})

const User = model('User', userSchema); // create a model

module.exports = User; // export the model