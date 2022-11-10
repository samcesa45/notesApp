const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware =require('./utils/middleware.js')
const notesRouter = require('./controller/notes.js')
const logger = require('./utils/logger.js')
const config = require('./utils/config.js')
const app = express()




const url  = config.MONGODB_URI
const run=async() => {
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



app.use('/api/notes',notesRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)




module.exports = app