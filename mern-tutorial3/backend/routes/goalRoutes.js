const express = require('express')  
const router = express.Router()

const {   
  getGoals,            
  setGoal,
  updateGoal,
  deleteGoal 
} = require('../controllers/goalController') 
//router.get('/', getGoals)

const { protect } = require('../middleware/authMiddleware')  
// JUST AS WE PROTECTED THE USER ROUTES, WE IMPORT THE PROTECT FUNC HERE TO PROTECT THE GOAL ROUTES AS WELL

router.route('/').get(protect, getGoals).post(protect, setGoal);  
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);  // we protect all our routes

module.exports = router