const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

describe('login test', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await api.post('/api/users').send({
      username: 'username123',
      name: 'Harry Potter',
      password: 'sekretPwass'
    })
  })

  test('login successful, token is returned with appropriate status code', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'username123',
        password: 'sekretPwass'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()
    expect(response.body.username).toBeDefined()
    expect(response.body.name).toBeDefined()
  })

  test('login unsuccessful with appropriate status code when username is missing', async () => {
    const response = await api
      .post('/api/login')
      .send({
        password: 'sekretPwass'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).not.toBeDefined()
    expect(response.body.username).not.toBeDefined()
    expect(response.body.name).not.toBeDefined()
  })

  test('login unsuccessful with appropriate status code when password field is missing', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'username123'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).not.toBeDefined()
    expect(response.body.username).not.toBeDefined()
    expect(response.body.name).not.toBeDefined()
  })

  test('login unsuccessful with appropriate status code when password do not match', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'username123',
        password: ''
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).not.toBeDefined()
    expect(response.body.username).not.toBeDefined()
    expect(response.body.name).not.toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})