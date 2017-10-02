import * as Utils from 'UTIL/filters'

describe('filters.js', () => {
  it('should judgement correct boolean 1', () => {
    expect(Utils.isEmptyObject({}))
      .to.equal(true)
  })
  it('should judgement correct boolean 2', () => {
    expect(Utils.isEmptyObject({ a: 1 }))
      .to.equal(false)
  })
  it('should be correct package name', () => {
    expect(Utils.enterpriseFilter(1))
      .to.equal('正式包')
  })
})
