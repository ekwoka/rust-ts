import { window } from '@/iterators/window'

describe('window', () => {
  it('should yield a rolling window of the given iterable', () => {
    const iter = window([1, 2, 3, 4, 5], 3)
    expect(Array.from(iter)).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5],
    ])
  })
})
