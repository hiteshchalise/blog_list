const loginRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

loginRouter.post('/', body('username').exists(), body('password').exists(), async (request, response) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() })
  }
  const { username, password } = request.body
  const userByUsername = await User.findOne({ username })
  const passwordMatches = userByUsername === null ?
    false
    : await bcrypt.compare(password, userByUsername.passwordHash)
  if (!(userByUsername && passwordMatches)) return response.status(401).json({ error: 'Password do not match' })

  const userForToken = {
    username: userByUsername.username,
    id: userByUsername._id
  }
  const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
  response.status(200).json({ token, username: userByUsername.username, name: userByUsername.name })
})

module.exports = loginRouter