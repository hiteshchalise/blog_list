const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
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
    await Blog.deleteMany({})
    const blogObjects = initialBlog.map(blog => {
        const blogObject = new Blog(blog)
        return blogObject.save()
    })
    await Promise.all(blogObjects)
})

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

test('post request creates new blog post', async () => {
    const newBlog = {
        title: 'A new post',
        author: 'Gus Fring',
        url: 'https://www.reddit.com/',
        likes: 13
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const title = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlog.length + 1)
    expect(title).toContain('A new post')
})

test('missing likes field defaults to zero', async () => {
    const newBlog = {
        title: 'new',
        author: 'new',
        url: 'http://lol.com'
    }
    const postResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlog.length + 1)
    expect(postResponse.body.likes).toBeDefined()
    expect(postResponse.body.likes).toBe(0)
})

test('missing title and url field responds with 400', async () => {
    const newBlog = {
        author: 'new',
        likes: 4
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
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