import express from 'express'
import cors from 'cors'
import Note from './models/note.js';
import mongoose from 'mongoose';
import middleware from './utils/middleware.js'
const app = express()


const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('---');
  next()
}

const url  = process.env.MONGODB_URI
const run = async() => {
  //connect to mongoDB
  mongoose.connect(url)
  console.log('connected')
  console.log('note saved!')

}

run().catch(err => console.error('error connecting to MongoDB',err.message))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)


  app.get('/api/notes', (req,res) => {
    Note.find({}).then(notes => {
      res.json(notes)

    })
  })

  app.get('/api/notes/:id', (req,res, next) => {
    const id = req.params.id
   Note.findById(id).then(note => {
    if(note){
      res.json(note)
      
    } else {
      res.status(404).end()
    }
   })
   .catch(error => next(error))
  })


  app.post('/api/notes', (req,res) => {

    const body = req.body 
    
    if(body.content === undefined){
      return res.status(400).json({
        error:'content missing'
      })
    }

    const note = new Note({
      content:body.content,
      important:body.important || false,
      date:new Date(),
    })

    note.save().then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))

  })


  app.put('/api/notes/:id', (req, res, next) => {
    const {content, important} = req.body

    const note = {
     content,
      important
    }

    Note.findByIdAndUpdate(req.params.id, note, {new:true, runValidators:true, content:'query'})
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
  })

  app.delete('/api/notes/:id', (req,res) => {
    const id = req.params.id
   
    Note.findByIdAndRemove(id).then(() =>{
      res.status(204).end()
    })
    .catch(error => next(error))

  })

 
  app.use(middleware.unknownEndPoint)
  app.use(middleware.errorHandler)
const PORT = process.env.PORT || 8000
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
    
})