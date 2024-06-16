import { inspect } from '@/iterators/inspect'

describe('inspect', () => {
  it('returns an iterator that calls a closure for each element in the iterable', () => {
    let count = 0
    let values = ''
    const closure = (val: string) => {
      count++
      values += val
    }
    const iter = inspect(['a', 'b', 'c'], closure)
    expect(count).toBe(0)
    expect(values).toBe('')
    expect([...iter]).toEqual(['a', 'b', 'c'])
    expect(count).toBe(3)
    expect(values).toBe('abc')
  })
})
