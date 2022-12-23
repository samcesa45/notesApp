const config = require('./utils/config.js')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware =require('./middleware/error.js')
const notesRouter = require('./controller/notes.js')
const logger = require('./utils/logger.js')
const usersRouter = require('./controller/users.js')
const loginRouter = require('./controller/login.js')
const testingRouter = require('./controller/testing_router.js')




const url  = config.MONGODB_URI
const run = async() => {
	//connect to mongoDB
	await mongoose.connect(url)
	logger.info('connected')
	logger.info('note saved!')
  
  }
  
  run().catch(err => logger.error(err))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)



app.use('/api/login',loginRouter)
app.use('/api/users',usersRouter)
app.use('/api/notes',notesRouter)

if(process.env.NODE_ENV === 'test' ){
	app.use('/api/testing',testingRouter)
}

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)




module.exports = app