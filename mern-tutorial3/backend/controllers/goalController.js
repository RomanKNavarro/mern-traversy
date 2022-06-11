const asyncHandler = require('express-async-handler')  

const Goal = require('../models/goalModel')   
const User = require('../models/userModel') 
// bring the userModel in as part of initiative to stop users from messing w/ eachothers' goals

// @desc Get goals            (description)
// @route   GET /api/goals    (the method to get goals)
// @access Private            (all of these will be private once we add authentication)
const getGoals = asyncHandler(async (req, res) => {     
  //const goals = await Goal.find({})   with this, we're getting ALL the goals in the database.   
  const goals = await Goal.find({user: req.user.id}) // but now we only get the current logged in user's goals  

  res.status(200).json(goals)
})

// @desc Set goal            
// @route   POST /api/goals    
// @access Private            
const setGoal = asyncHandler(async (req, res) => { 
  if (!req.body.text) {                           
    res.status(400)
    throw new Error('please add a text field')  
  }

  const goal = await Goal.create({   
    text: req.body.text,
    user: req.user.id     // make it so that in the goal request, it shows the user's id as well.
  })

  res.status(200).json(goal)    
})

// @desc Update goal            
// @route   PUT /api/goals/:id    
// @access Private            
const updateGoal = asyncHandler(async (req, res) => {     
  const goal = await Goal.findById(req.params.id)       
  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  const user = await User.findById(req.user.id)   // get user by it's id

  // check for user
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== user.id) {   // goal.user basically stores the user id (not as string), it seems
    res.status(401)
    throw new Error('User not authorized')
  }
  /* notice how this stuff is strategically placed above the "updatedGoal" func. This ensures the user checks out 
  first before they can access that func. */


  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})  
  res.status(200).json(updatedGoal) 
})

// @desc Delete goal             
// @route   DELETE /api/goals/:id    
// @access Private            
const deleteGoal = asyncHandler(async (req, res) => {    
  const goal = await Goal.findById(req.params.id)   
  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  const user = await User.findById(req.user.id)   // get user by it's id

  // Paste the checking stuff from updateGoal, but now for the delete stuff 
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (goal.user.toString() !== user.id) {   
    res.status(401)
    throw new Error('User not authorized')
  }

  await goal.remove()
  res.status(200).json({ id: req.params.id })		
})

module.exports = {
  getGoals,            
  setGoal,
  updateGoal,
  deleteGoal
}































