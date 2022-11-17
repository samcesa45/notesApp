const logger = require('./logger.js')

//to be removed soon
const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}


const errorHandler = (error, req, res, next) => {


  if(error.name === 'CastError') {
    return res.status(400).send({ error:'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error:error.message })
  }else if(error.name === 'JsonWebTokenError'){
    return res.status(401).json({
      error:'invalid token'
    })
  }else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error:'token expired'
    })
  }

  logger.error(error.message)

  next(error)
}

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error:'unknown endpoint' })
}



module.exports = {
  errorHandler,
  unknownEndPoint,
  requestLogger
}