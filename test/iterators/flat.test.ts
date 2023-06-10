import { flat } from '@/iterators/flat';

describe('flat', () => {
  it('returns an iterator over flattened values', () => {
    expect([...flat([1, [2, 3], [4, [5, 6]]])]).toEqual([1, 2, 3, 4, [5, 6]]);
  });
});
