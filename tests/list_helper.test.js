const listHelper = require('./../utils/list_helper')

test('dummy returns one', () => {
    expect(listHelper.dummy(0)).toBe(1)
})