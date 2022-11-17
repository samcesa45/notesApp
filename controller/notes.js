const jwt = require('jsonwebtoken')
const express = require('express')
const  Note = require('../models/note.js')
const User = require('../models/user')
const notesRouter = express.Router()


notesRouter.get('/', async (_req,res,next) => {
  try {
    const notes = await Note.find({}).populate('user', {username:1, name:1})
     res.status(200).json(notes)
  } catch (error) {
    next(error)
  }

})

notesRouter.get('/:id', async (req,res, next) => {
  const id = req.params.id
  try {
    const note = await Note.findById(id)
    if(note){
      res.json(note)
    }else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
 
})


const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }

  return null
}
notesRouter.post('/', async (req,res,next) => {
  const body = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!decodedToken.id){
    return res.status(401).json({error:'token missing or invalid'})
  }

  const user = await User.findById(decodedToken.id)
  const note = new Note({
    content:body.content,
    important:body.important || false,
    date:new Date(),
    user:user._id
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.json(savedNote)
  } catch (error) {
    next(error)
  }

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

notesRouter.delete('/:id', async (req,res,next) => {
  const id = req.params.id
  
  try {
    await Note.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})


module.exports = notesRouter
