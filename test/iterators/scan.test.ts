import { scan } from '@/iterators/scan'

describe('scan', () => {
  it('returns an iterator that maintains an internal state to fold values', () => {
    const iter = scan([1, 2, 3], (acc, item) => (acc[0] = acc[0] ** item), 2)
    expect([...iter]).toEqual([2, 4, 64])
  })
})
