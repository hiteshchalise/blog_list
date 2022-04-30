const listHelper = require('./../utils/list_helper')
const object = require('lodash/object')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        blogs: 3,
        __v: 0
    }
]

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        blogs: 3,
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        blogs: 4,
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        blogs: 10,
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        blogs: 3,
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        blogs: 6,
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        blogs: 1,
        likes: 2,
        __v: 0
    }
]

test('dummy returns one', () => {
    expect(listHelper.dummy([])).toBe(1)
})

describe('total likes', () => {

    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    test('of bigger list is calculated right', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })
})

describe('favorite blog', () => {
    test('form single item list is itself', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(object.pick(listWithOneBlog[0], ['title', 'author', 'likes']))
    })
    test('from multiple item list is correctly returned', () => {
        expect(listHelper.favoriteBlog(blogs)).toEqual(object.pick(blogs[2], ['title', 'author', 'likes']))
    })
})

describe('most blogs', () => {
    test('from single item list is itself', () => {
        expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(object.pick(listWithOneBlog[0], ['author', 'blogs']))
    })

    test('from multiple item list will return correct item with most blogs', () => {
        expect(listHelper.mostBlogs(blogs)).toEqual(object.pick(blogs[2], ['author', 'blogs']))
    })
})

describe('most liked blog', () => {
    test('from single item list is single item', () => {
        expect(listHelper.mostLikes(listWithOneBlog)).toEqual(object.pick(listWithOneBlog[0], ['author', 'likes']))
    })

    test('from multiple item list will return correct item with most likes', () => {
        expect(listHelper.mostLikes(blogs)).toEqual(object.pick(blogs[2], ['author', 'likes']))
    })
})