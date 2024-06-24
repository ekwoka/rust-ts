import { arrayChunks } from '@/iterators/arrayChunks'

describe('arrayChunks', () => {
  it('Chunks iterable to arrays', () => {
    const iter = arrayChunks([1, 2, 3, 4, 5, 6], 2)
    expect([...iter]).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
  })
  it('Returns partial final array', () => {
    const iter = arrayChunks([1, 2, 3, 4, 5], 2)
    expect([...iter]).toEqual([[1, 2], [3, 4], [5]])
  })
})
