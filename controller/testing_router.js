const testingRouter = require('express').Router()
const Note = require('../models/note.js')
const User = require('../models/user.js')

testingRouter.post('/reset', async (req, res) => {
    await User.deleteMany({})
    await Note.deleteMany({})

    res.status(204).end()
    
})

module.exports = testingRouter