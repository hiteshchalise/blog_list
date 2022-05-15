const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('./../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { token, body, user } = request

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid.' })
  }

  body.user = user._id

  const blog = new Blog(body)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  if (!decodedToken.id) {
    return response.status(400).json({ error: 'Token missing or invalid' })
  }
  const blog = await Blog.findById({ _id: id })
  if (!blog) return response.status(404).json({ error: 'No blog found' })
  if (blog.user && decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'Unauthorized delete' })
  }

  await Blog.findByIdAndRemove(blog._id)
  return response.status(204).end()
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
  ).populate('user', { username: 1, name: 1, id: 1 })
  if (!updatedBlog) {
    return response.status(404).json({ error: 'Id not found.' })
  } else {
    return response.status(200).json(updatedBlog)
  }
})

module.exports = blogRouter