const express = require('express')
const  Note = require('../models/note.js')
const notesRouter = express.Router()


notesRouter.get('/', async (_req,res,next) => {
  try {
    const notes = await Note.find({})
    console.log(res.body);
     res.status(200).json(notes)
  } catch (error) {
    next(error)
  }

})

notesRouter.get('/:id', (req,res, next) => {
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


notesRouter.post('/', (req,res,next) => {

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

  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))

})


notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body

  const note = {
    content,
    important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new:true, runValidators:true, content:'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (req,res,next) => {
  const id = req.params.id

  Note.findByIdAndRemove(id).then(() => {
    res.status(204).end()
  })
    .catch(error => next(error))

})


module.exports = notesRouter
