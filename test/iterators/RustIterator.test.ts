import { RustIterator } from '../../src/iterators/RustIterator';

describe('RustIterator', () => {
  it('wraps an iterable', () => {
    const iter = new RustIterator([1, 2, 3]);
    expect([...iter]).toEqual([1, 2, 3]);
  });
  it('wraps an iterator', () => {
    const iter = new RustIterator([1, 2, 3][Symbol.iterator]());
    expect([...iter]).toEqual([1, 2, 3]);
  });
});

describe('state methods', () => {
  it('.done', () => {
    const iter = new RustIterator([1, 2, 3]);
    iter.next();
    expect(iter.done).toBe(false);
    iter.next();
    expect(iter.done).toBe(false);
    iter.next();
    expect(iter.done).toBe(false);
    iter.next();
    expect(iter.done).toBe(true);
  });
});

describe('consumption methods', () => {
  it('.next', () => {
    const iter = new RustIterator([1, 2, 3]);
    expect(iter.next()).toEqual({ value: 1, done: false });
    expect(iter.next()).toEqual({ value: 2, done: false });
    expect(iter.next()).toEqual({ value: 3, done: false });
    expect(iter.next()).toEqual({ value: undefined, done: true });
  });
  it('.nextChunk', () => {
    const iter = new RustIterator([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(iter.nextChunk(2)).toEqual({ value: [1, 2], done: false });
    expect(iter.nextChunk(3)).toEqual({ value: [3, 4, 5], done: false });
    expect(iter.nextChunk(4)).toEqual({ value: [6, 7, 8], done: true });
  });
  it('.count', () => {
    const iter = new RustIterator([1, 2, 3]);
    expect(iter.count()).toEqual(3);
  });
  it('.last', () => {
    const iter = new RustIterator([1, 2, 3]);
    expect(iter.last()).toEqual(3);
  });
  it('.advanceBy', () => {
    const iter = new RustIterator([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(iter.next().value).toBe(1);
    expect(iter.next().value).toBe(2);
    iter.advanceBy(3);
    expect(iter.next().value).toBe(6);
  });
  it('.nth', () => {
    const iter = new RustIterator([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(iter.nth(0)).toEqual(1);
    expect(iter.nth(1)).toEqual(3);
    expect(iter.nth(2)).toEqual(6);
    expect(iter.nth(3)).toEqual(undefined);
  });
});

describe('Iterator methods', () => {
  describe('.collect', () => {
    it('collects into an array', () => {
      const iter = new RustIterator([1, 2, 3]);
      expect(iter.collect()).toEqual([1, 2, 3]);
    });
  });
  describe('.map', () => {
    it('maps to a new iterator', () => {
      const iter = new RustIterator([1, 2, 3]).map((x) => x * 2);
      expect([...iter]).toEqual([2, 4, 6]);
    });
  });
  describe('.filter', () => {
    it('filters to a new iterator', () => {
      const iter = new RustIterator([1, 2, 3]).filter((x) => x % 2 === 0);
      expect([...iter]).toEqual([2]);
    });
  });
  describe('.take', () => {
    it('takes from an iterator', () => {
      const iter = new RustIterator([1, 2, 3]).take(2);
      expect([...iter]).toEqual([1, 2]);
    });
  });
  describe('.stepBy', () => {
    it('steps over an iterator', () => {
      const iter = new RustIterator([1, 2, 3, 4, 5, 6, 7, 8]).stepBy(3);
      expect([...iter]).toEqual([1, 4, 7]);
    });
  });
  describe('.chain', () => {
    it('chains two iterables', () => {
      const iter = new RustIterator([1, 2, 3]).chain([4, 5, 6]);
      expect([...iter]).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
  describe('.zip', () => {
    it('zips two iterables', () => {
      const iter = new RustIterator([1, 2, 3]).zip([4, 5, 6]);
      expect([...iter]).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
    });
  });
  describe('.forEach', () => {
    it('calls a closure for each element in the iterable', () => {
      let count = 0;
      let values = '';
      const closure = (val: string) => {
        count++;
        values += val;
      };
      new RustIterator(['a', 'b', 'c']).forEach(closure);
      expect(count).toBe(3);
      expect(values).toBe('abc');
    });
  });
  describe('.enumerate', () => {
    it('enumerates an iterable', () => {
      const iter = new RustIterator(['a', 'b', 'c']).enumerate();
      expect([...iter]).toEqual([
        [0, 'a'],
        [1, 'b'],
        [2, 'c'],
      ]);
    });
  });
});
