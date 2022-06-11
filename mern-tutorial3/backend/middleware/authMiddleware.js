const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')          // import stuff

const protect = asyncHandler(async (req, res, next) => {    // there's "next" since this is middleware.
  let token   // initialize "token" for later

  // this is going to be sent in the "htp" headers, where there's an "authorization" object.
  /* when a token is sent, in the authorization header it's formatted as "Bearer...(token number)". so we want to make 
    sure the token starts with "Bearer". */
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]  // so that we only get the token and not "Bearer"

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)   // decode the token

      // get user from the token (token has user id as its payload)
      req.user = await User.findById(decoded.id).select('-password')
      /* assign token to req.user so we can access req.user from any route that's protected. Here we pass in the decoded
      token so we can access it's payload 
      select('-password') means that the payload won't include the password. We don't want the password, even though it's 
      hashed. */

      next() // we call next b/c at the end of our middleware we want to be able to call the next piece of middleware
    } catch (error) {
      console.log(error)
      res.status(401)     // the 401 error means "not authorized"
      throw new Error('Not authorized')
    }
  }   
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')   // if there's no token, throw error.
  }
})


module.exports = { protect }