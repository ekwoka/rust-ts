import { RustIterator } from '@/iterators/RustIterator';
import { flat, flatMap } from '@/iterators/flat';

describe('flat', () => {
  it('returns an iterator over flattened values', () => {
    expect([...flat([1, [2, 3], [4, [5, 6]]])]).toEqual([1, 2, 3, 4, [5, 6]]);
  });
  it('allows flattening a specific depth', () => {
    expect([...flat([1, [2, 3], [4, [5, 6]]], 2)]).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('can flatten any iterable', () => {
    expect([
      ...flat(
        [1, new Set([2, new Map([[3, 4]]), new RustIterator([5, [6]])])],
        2,
      ),
    ]).toEqual([1, 2, [3, 4], 5, [6]]);
  });
});
describe('flatMap', () => {
  it('returns an iterator that maps over an iterable and flattens the returned values', () => {
    expect([...flatMap(['hello', ['world']], (val) => val)]).toEqual([
      'hello',
      'world',
    ]);
  });
});
