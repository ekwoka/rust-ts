import { chain } from '@/iterators/chain';

describe('chain', () => {
  it('chains two iterables', () => {
    const iter = chain([1, 2, 3], [4, 5, 6]);
    expect([...iter]).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('chains many iterables', () => {
    const iter = chain([1, 2, 3], [4, 5, 6], [7, 8, 9]);
    expect([...iter]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
