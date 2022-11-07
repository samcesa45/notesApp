import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'
import notesRouter from './controller/notes.js'
import logger from './utils/logger.js'
import config from './utils/config.js'
const app = express()




const url  = config.MONGODB_URI
const run = async() => {
  //connect to mongoDB
  mongoose.connect(url)
  logger.info('connected')
  logger.info('note saved!')

}

run().catch(err => logger.error('error connecting to MongoDB',err.message))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)



app.use('/api/notes',notesRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)




export default app