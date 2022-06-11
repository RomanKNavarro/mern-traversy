// THIS THE FILE WE'LL USE TO CONNECT TO MONGODB USING "MONGOOSE"

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)    // pass our uri from .env
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);   
    /* once it connects (hence, "await"), we console.log. In the curly braces we get a "connection" obj and from
    it a "host" object, all from the conn variable. The custom colors come from the colors package.  */
  } catch (error) {
    console.log(error)    // if there's an error, console.log it and exit the process with an error (1)
    process.exit(1)
  }
}

module.exports = connectDB  // to export into server.js to run it.