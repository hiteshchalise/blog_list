const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const app = require('../app')
const helper = require('../utils/helper.js')

const api = supertest(app)


describe('when there is single user', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('superSecretPassword', 10)
        const user = new User({
            username: 'username123',
            name: 'Foo Bar',
            passwordHash
        })

        await user.save()
    })

    test('GET users will return single user', async () => {
        const response = await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const usersInDb = await helper.usersInDb()
        expect(response.body).toEqual(usersInDb)
        expect(response.body[0].passwordHash).not.toBeDefined()
        expect(response.body[0]._id).not.toBeDefined()
        expect(response.body[0].__v).not.toBeDefined()
        expect(response.body[0].id).toBeDefined()
    })

    test('user creation successful with fresh username', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'newUser123',
            name: 'New User',
            password: 'anythingGoes'
        }

        const response = await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.id).toBeDefined()
        expect(response.body.username).toBe(newUser.username)
        expect(response.body.name).toBe(newUser.name)

        const newUserList = await helper.usersInDb()

        expect(newUserList).toHaveLength(initialUsers.length + 1)

    })


    test('user creation fails when no username given', async () => {
        const initialUsers = await helper.usersInDb()
        const improperUser = {
            password: 'newpass'
        }
        await api.post('/api/users')
            .send(improperUser)
            .expect(400)

        const finalUsers = await helper.usersInDb()
        expect(initialUsers).toEqual(finalUsers)
    })

    test('user creation fails when empty username given', async () => {
        const initialUsers = await helper.usersInDb()
        const improperUser = {
            username: '',
            password: 'newpass'
        }
        await api.post('/api/users')
            .send(improperUser)
            .expect(400)

        const finalUsers = await helper.usersInDb()
        expect(initialUsers).toEqual(finalUsers)
    })

    test('user creation fails when username with length less then 3 is given', async () => {
        const initialUsers = await helper.usersInDb()
        const improperUser = {
            username: 'ar',
            password: 'newpass'
        }
        await api.post('/api/users')
            .send(improperUser)
            .expect(400)

        const finalUsers = await helper.usersInDb()
        expect(initialUsers).toEqual(finalUsers)
    })

    test('user creation fails when no password given', async () => {
        const initialUsers = await helper.usersInDb()
        const improperUser = {
            username: 'ValidUsername'
        }
        await api.post('/api/users')
            .send(improperUser)
            .expect(400)

        const finalUsers = await helper.usersInDb()
        expect(initialUsers).toEqual(finalUsers)
    })

    test('user creation fails when empty password given', async () => {
        const initialUsers = await helper.usersInDb()
        const improperUser = {
            username: 'ValidUsername',
            password: ''
        }
        await api.post('/api/users')
            .send(improperUser)
            .expect(400)

        const finalUsers = await helper.usersInDb()
        expect(initialUsers).toEqual(finalUsers)
    })

    test('user creation fails when password with length less then 3 is given', async () => {
        const initialUsers = await helper.usersInDb()
        const improperUser = {
            username: 'ValidUsername',
            password: 'ne'
        }
        await api.post('/api/users')
            .send(improperUser)
            .expect(400)

        const finalUsers = await helper.usersInDb()
        expect(initialUsers).toEqual(finalUsers)
    })
})



afterAll(() => {
    mongoose.connection.close()
})
