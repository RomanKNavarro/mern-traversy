// JUST AS WE CREATED ROUTES FOR GOALS, SAME WITH USERS: 
// we're gonna have 3: one to register, one to login, and another to get the user's info

const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, } = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')   // import protect func

router.post('/', registerUser)    // Why is only '/' used? api/users was already specified in server.js
router.post('/login', loginUser)  // as you can see, these two are posts ("create") and the other is a get ("read").
router.get('/me', protect, getMe) // crazy: we can just pass in that whole func as "protect" here       

/* they each have different "endpoints", which is like a path. You paste their 
path in postman to send requests w/ their respective functionalities */

module.exports = router //  REMEMBER TO EXPORT 