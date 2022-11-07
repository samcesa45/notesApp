import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  content:{
    type:String,
    minLength:5,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  important:Boolean
})

noteSchema.set('toJSON',{
  transform:(_document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Note = mongoose.model('Note',noteSchema)


export default Note