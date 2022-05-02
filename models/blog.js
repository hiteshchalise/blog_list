const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    author: String,
    url: {
        type: String,
        required: [true, 'Url is required']
    },
    likes: {
        type: Number,
        default: 0
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
