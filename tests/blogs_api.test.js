const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const initialBlog = [
    {
        title: 'A new beginning',
        author: 'Jonas Kahnwald',
        url: 'https://www.google.com/',
        likes: 123
    },
    {
        title: 'Beginning is the end',
        author: 'Amon Gus',
        url: 'https://www.youtube.com/',
        likes: 12
    },
]

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('superSecretPassword', 10)
    const user = new User({
        username: 'username123',
        name: 'Foo Bar',
        passwordHash
    })

    await user.save()

    await Blog.deleteMany({})
    const blogObjects = initialBlog.map(blog => {
        const blogObject = new Blog(blog)
        return blogObject.save()
    })
    await Promise.all(blogObjects)
})

describe('GET  requests for blog api', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(2)
    })

    test('unique identifier is named id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

})

describe('POST requests for blog api', () => {

    const validBlog = {
        title: 'A new post',
        author: 'Gus Fring',
        url: 'https://www.reddit.com/',
        likes: 13
    }

    const blogWithMissingLikes = {
        title: 'new',
        author: 'new',
        url: 'http://lol.com'
    }

    const blogWithMissingTitleAndUrl = {
        author: 'new',
        likes: 4
    }

    test('post request creates new blog post', async () => {

        await api
            .post('/api/blogs')
            .send(validBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const title = response.body.map(r => r.title)

        expect(response.body).toHaveLength(initialBlog.length + 1)
        expect(title).toContain('A new post')
    })

    test('missing likes field defaults to zero', async () => {

        const postResponse = await api
            .post('/api/blogs')
            .send(blogWithMissingLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlog.length + 1)
        expect(postResponse.body.likes).toBeDefined()
        expect(postResponse.body.likes).toBe(0)
    })

    test('missing title and url field responds with 400', async () => {
        await api
            .post('/api/blogs')
            .send(blogWithMissingTitleAndUrl)
            .expect(400)
    })

    test('creating a valid blog post will attatch user id', async () => {
        const response = await api
            .post('/api/blogs')
            .send(validBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.user).toBeDefined()

        const userById = await User.findById(response.body.user)
        expect(userById._id.toString()).toEqual(response.body.user)
    })

    test('creating a valid blog post will attatch blog id to user\'s blog field', async () => {
        const response = await api
            .post('/api/blogs')
            .send(validBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const userById = await User.findById(response.body.user)

        expect(userById.blogs.includes(response.body.id)).toBe(true)
    })
})

describe('deleting blog post', () => {
    test('when id is valid, status is 204', async () => {
        const blog = await Blog.findOne({})
        const response = await api
            .delete('/api/blogs/' + blog._id)
        expect(response.status).toBe(204)

        const newList = await Blog.find({})
        const blogTitles = newList.map(n => n.title)
        expect(blogTitles).not.toContain(blog.title)
    })
    test('when id cannot be found, status is 404', async () => {
        await api
            .delete('/api/blogs/6269ff69774048bfe9d45bff')
            .expect(404)
    })
    test('when id is malformed, status is 400', async () => {
        await api
            .delete('/api/blogs/6')
            .expect(400)
    })
})

describe('updating blog post', () => {
    const blogUpdate = {
        title: 'End is the beginning',
        author: 'Dover Ben',
        url: 'https://www.google.com/',
        likes: 321
    }
    test('when id is valid, status is 200', async () => {
        const blog = await Blog.findOne({})
        const response = await api
            .put('/api/blogs/' + blog._id)
            .send(blogUpdate)
        expect(response.status).toBe(200)

        const updatedBlog = await Blog.findById(blog._id)
        expect(updatedBlog.title).toBe(blogUpdate.title)
        expect(updatedBlog.author).toBe(blogUpdate.author)
        expect(updatedBlog.url).toBe(blogUpdate.url)
        expect(updatedBlog.likes).toBe(blogUpdate.likes)
    })
    test('when id cannot be found, status is 404', async () => {
        await api
            .put('/api/blogs/6269ff69774048bfe9d45bff')
            .send(blogUpdate)
            .expect(404)
    })
    test('when id is malformed, status is 400', async () => {
        await api
            .put('/api/blogs/6')
            .send(blogUpdate)
            .expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})