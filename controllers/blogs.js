const blogRouter = require('express').Router()
const Blog = require('./../models/blog')
const User = require('./../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const newBlog = request.body

    // This will be changed to the user who created the blog later
    const user = await User.findOne({})
    newBlog.user = user._id

    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
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