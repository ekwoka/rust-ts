import { RustIterator } from '../../src/iterators/RustIterator';

describe('RustIterator', () => {
  it('wraps an iterable', () => {
    const iter = new RustIterator([1, 2, 3]);
    expect([...iter]).toEqual([1, 2, 3]);
  });
  it('wraps an iterator', () => {
    const iter = new RustIterator([1, 2, 3][Symbol.iterator]());
    expect([...iter]).toEqual([1, 2, 3]);
  })
  describe('.collect', () => {
    it ('collects into an array', () => {
      const iter = new RustIterator([1, 2, 3]);
      expect(iter.collect()).toEqual([1, 2, 3]);
    })
  })
  describe('.map', () => {
    it('maps to a new iterator', () => {
      const iter = new RustIterator([1, 2, 3]).map(x => x * 2);
      expect([...iter]).toEqual([2, 4, 6]);
    })
  })
  describe('.filter', () => {
    it('filters to a new iterator', () => {
      const iter = new RustIterator([1, 2, 3]).filter(x => x % 2 === 0);
      expect([...iter]).toEqual([2]);
    })
  })
  describe('.take', () => {
    it('takes from an iterator', () => {
      const iter = new RustIterator([1, 2, 3]).take(2);
      expect([...iter]).toEqual([1, 2]);
    })
  });
});