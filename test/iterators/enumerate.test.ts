import { enumerate } from '@/iterators/enumerate';

describe('enumerate', () => {
  it('enumerates an iterable', () => {
    const iter = enumerate(['a', 'b', 'c']);
    expect([...iter]).toEqual([
      [0, 'a'],
      [1, 'b'],
      [2, 'c'],
    ]);
  });
});
