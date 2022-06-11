// WITH EVERY GOAL, WE NEED TO KNOW WHICH USER CREATED IT.

const mongoose = require('mongoose')
const goalSchema = mongoose.Schema(
  {
    user: {
      // vv an object id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // reference to know which model this obj id pertains to (user)      
    },
    text: {
      type: String,    
      required: [true, 'Please add a text value']   
    }
  }, 
  {
    timestamps: true  
  }
)

module.exports = mongoose.model('Goal', goalSchema)   