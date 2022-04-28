const logger = require('./logger')

const requestLogger = (req, _, next) => {
    logger.info('Method: ', req.method)
    logger.info('Path:   ', req.path)
    logger.info('Body:   ', req.body)
    logger.info('........')
    next()
}

const unknownEndPoint = (req, res) => {
    res.status(404).json({ error: 'Unknown Endpoint' })
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Malformed Id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    requestLogger, unknownEndPoint, errorHandler
}