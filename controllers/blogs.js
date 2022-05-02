const blogRouter = require('express').Router()
const Blog = require('./../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findOneAndRemove({ _id: id })
    if (!blog) return response.status(404).json({ error: 'no id found' })
    else return response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes
        },
        { new: true, runValidators: true, context: 'query' }
    )
    if (!updatedBlog) {
        return response.status(404).json({ error: 'Id not found.' })
    } else {
        return response.status(200).json(updatedBlog)
    }
})

module.exports = blogRouter