const object = require('lodash/object')

const dummy = (blogs) => {
    // just dummy for testing test setup.
    const length = blogs.length + 1
    return length / length
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => {
        return acc + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((mostLikedBlog, currentBlog) => {
        if (mostLikedBlog.likes < currentBlog.likes) return object.pick(currentBlog, ['title', 'author', 'likes'])
        else return mostLikedBlog
    }, object.pick(blogs[0], ['title', 'author', 'likes']))
}

const mostBlogs = (blogs) => {
    return blogs.reduce((mostBlogs, currentBlog) => {
        if (mostBlogs.blogs < currentBlog.blogs) return { author: currentBlog.author, blogs: currentBlog.blogs }
        else return mostBlogs
    }, { author: blogs[0].author, blogs: blogs[0].blogs })
}

const mostLikes = (blogs) => {
    return blogs.reduce((mostLikes, currentBlog) => {
        return mostLikes.likes < currentBlog.likes ?
            object.pick(currentBlog, ['author', 'likes']) : mostLikes
    }, object.pick(blogs[0], ['author', 'likes']))
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}