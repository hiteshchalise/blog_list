const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const config = require('./utils/config')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')


logger.info('Connecting to MongoDB')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Successfully connected to MongoDB')
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDb ${error.message}`)
  })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)
module.exports = app