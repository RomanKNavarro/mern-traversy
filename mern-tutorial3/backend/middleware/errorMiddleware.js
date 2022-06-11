/* all middleware consists of are just funcs that execute during the request/response cycle */
const errorHandler = (err, req, res, next) => {     
  // to override default express handler, pass "err". "next" is to call any further middleware.
  const statusCode = res.statusCode ? res.statusCode : 500
  // res.statusCode is just "res.status", already defined in goalController.js as mainly 200.
  res.status(statusCode) // set status code to either res.statusCode or 500

  res.json({                // respond with json.
    message: err.message,   // on the "err" obj passed as arg, there's a message property we can pass.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
    /* ^ we can also get the stack trace, which gives us additional info, but we only want to show that if 
    we're in DEVELOPMENT mode. If we're in PRODUCTION mode, return null. to change the "mode", go to .env
    in the root.*/
  })

  // basically, we replace the default html error with a json one.
}

module.exports = {
  errorHandler,       // export an object with errorHandler (b/c you can have other types of err handlers as well)
}
