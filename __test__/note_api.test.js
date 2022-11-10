
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


test('are returned as json', async () => {
    await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 1 notes', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(1)
})

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    console.log(response.body);
    expect(response.body[0].content).toBe('Html is easy')
})

afterAll(() => {
   mongoose.connection.close()
});