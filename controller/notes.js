
const express = require('express')
const notesRouter = express.Router()
const  Note = require('../models/note.js')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')



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



notesRouter.post('/',auth, async (req,res,next) => {
  try {
    
  const body = req.body
  const user = await User.findById(req.user.id)
  const note = new Note({
    content:body.content,
    important:body.important || false,
    date:new Date(),
    user:user._id
  })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.json(savedNote)
  } catch (exception) {
    next(exception)
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

notesRouter.delete('/:id', auth, async (req,res,next) => {
  
  try {
   const userid = req.user.id
   const blog = await Note.findById(req.params.id)
   if(blog.user.toString() === userid.toString()){
    await blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
   }else{
    res.status(404).end()
   }
  } catch (error) {
    next(error)
  }
})


module.exports = notesRouter
