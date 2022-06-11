// REMEMBER: IN THE BACKEND, YOU ALWAYS WANT TO EXPORT MODULES LIKE THIS:
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')       // async, for mongoose as well as bcrypt
const User = require('../models/userModel.js')   // "DEPENDENCIES"

/* REMEMBER: in userRoutes.js, we can easily just pass in the functionality into each of the routes' callback funcs. But 
it's better practice to create a controller (hence this folder and file) and have your funcs here. */

// @desc                        Register new user.
// @route   POST /api/users    (the method to get users)
// @access Public            Obviously public b/c you can't access a protected route without being logged in
const registerUser = asyncHandler(async(req, res) => {
  const {name, email, password} = req.body  // destructure the data from req.body 
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  // check if user exists
  const userExists = await User.findOne({email})  // use "findOne" method on the imported user model to find user by email
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')  // throw error if user already exists.
  }

  // hash password with bcrypt:
  const salt = await bcrypt.genSalt(10)  
  // we need a "salt" to do any hashing. genSalt() takes a number of "rounds", the default being 10
  const hashedPassword = await bcrypt.hash(password, salt)  // bcrypt.hash takes the plaintext pw from postman and the salt
  
  // create user
  const user = await User.create({    // if the user does not exist, create new user.
    name,
    email,
    password: hashedPassword      // make password the hashed password we created.

  })

  // send response code
  if (user) {                   // if user is created...
    res.status(201).json({      // status 201 means OK and also that something was created (in this case, a new user)
      _id:  user.id,             // we could just put the token, but we want to send back some other data, like this id
      name: user.name,
      email: user.email,
      token: generateToken(user._id)  // return a token generated with this func as well (see below)
    })   
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc                       Authenticate a new user
// @route   POST /api/users/login    
// @access Public           
const loginUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body          // destructure to get email and password
  const user = await User.findOne({email})    // check for user email

  /* now we need to compare the given password to the hashed one we have stored in the data and check if they're the same.
  To do this, we use bcrypt.compare(). See line 14 for the password WE send on our end. user.password is the one in the database */
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({          // if OK, we send the same data we've sent as when they register (see above)
      _id:  user.id,             
      name: user.name,
      email: user.email,
      token: generateToken(user._id)  // return a token generated with this func as well (see below)
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')    // else throw same error
  }
})

// @desc                         get user data
// @route   GET /api/users/me    get the info for the current user. We send the token and get id from that token
// @access Private               make this private for when authenticating            
const getMe = asyncHandler(async(req, res) => {
  //res.json({message: 'User data'})    
  const { _id, name, email } = await User.findById(req.user.id)   // deconstruct user data
  res.status(200).json({  // return that user data instead of just {message: 'User data'}
    id: _id,
    name, 
    email
  })
})

// generate JWT
const generateToken = (id) => {    // takes in user id b/c that's what we want to put as the "payload"
  // vvv this is a method from the jwt module we imported. We pass the payload (the data we want to put in), secret, and expiration
  return jwt.sign({ id }, process.env.JWT_SECRET, {   // signs a new token with the given id with the secret from .env
    expiresIn:'30d',    // token expires in 30 days after being used.
  }) 
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}