const mongoose = require('mongoose')    // mongoose is the ODM we use to interact with MongoDb and to create models & their schemas.

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']     // make the field for the User model required. 
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true                              // so that we don't get any two repeating emails    
  },
  password: {
    type: String,
    required: [true, 'Please add a password']      
  }
},
{
  timestamps: true  // add timestamps to this model too
})

module.exports = mongoose.model('User', userSchema)