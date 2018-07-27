import isEmptyQuery from 'util/isEmptyQuery'

describe('测试那些在query应该被认为是空的值', () => {
  it('测试空值', () => {
    expect(isEmptyQuery([])).toBe(true)
    expect(isEmptyQuery([''])).toBe(true)
    expect(isEmptyQuery(['', null, ''])).toBe(true)
    expect(isEmptyQuery(['', 0, ''])).toBe(false)
    expect(isEmptyQuery('')).toBe(true)
    expect(isEmptyQuery(0)).toBe(false)
    expect(isEmptyQuery(21)).toBe(false)
    expect(isEmptyQuery('123')).toBe(false)
    expect(isEmptyQuery(null)).toBe(true)
    expect(isEmptyQuery(undefined)).toBe(true)
    expect(isEmptyQuery()).toBe(true)
  })
})
