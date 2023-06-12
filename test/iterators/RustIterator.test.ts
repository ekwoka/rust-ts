import { PeekableRustIterator, RustIterator } from '@/iterators/RustIterator';

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

describe('properties', () => {
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
  describe('.fold/.reduce', () => {
    it('reduces iterable into a single value', () => {
      const folded = new RustIterator(
        Object.entries({ a: 1, b: 2, c: 3 })
      ).fold((acc, [key, val]) => ((acc[key] = val), acc), {} as any);
      expect(folded).toEqual({ a: 1, b: 2, c: 3 });
      const reduced = new RustIterator(
        new Set(Object.values({ a: 1, b: 2, c: 3 }))
      ).reduce((acc, item) => acc * item, 1);
      expect(reduced).toEqual(6);
    });
    it('uses first element as the initial value', () => {
      const foldedsum = new RustIterator([1, 2, 3]).fold((acc, x) => acc + x);
      expect(foldedsum).toBe(6);
      const reducedsum = new RustIterator([1, 2, 3]).reduce(
        (acc, x) => acc + x
      );
      expect(reducedsum).toBe(6);
    });
  });
  describe('.sum', () => {
    it('sums iterable of numbers', () => {
      const iter = new RustIterator([1, 2, 3]);
      expect(iter.sum()).toBe(6);
    });
    it('concatenates iterable of strings', () => {
      const iter = new RustIterator(['a', 'b', 'c']);
      expect(iter.sum()).toBe('abc');
    });
  });
  describe('.find/.any/.all', () => {
    it('find an element in an iterable', () => {
      const iter = new RustIterator([1, 2, 3, 4, 5]);
      expect(iter.find((x) => !(x % 2))).toBe(2);
      expect(iter.find((x) => x % 2)).toBe(3);
      expect(iter.find((x) => typeof x === 'string')).toBe(null);
    });
    it('checks if any element in an iterable matches a predicate', () => {
      const numbers = new RustIterator([1, 2, 3, 4, 5]);
      const strings = new RustIterator(['a', 'b', 'c']);
      const mixed = new RustIterator([1, 'a', 2, 'b', 3, 'c']);
      expect(numbers.any((x) => typeof x === 'number')).toBe(true);
      expect(strings.any((x) => typeof x === 'number')).toBe(false);
      expect(mixed.any((x) => typeof x === 'number')).toBe(true);
      expect(mixed.any((x) => typeof x === 'string')).toBe(true);
      expect(new RustIterator([]).any(Boolean)).toBe(false);
    });
    it('checks if all elements in an iterable match a predicate', () => {
      const numbers = new RustIterator([1, 2, 3, 4, 5]);
      const mixed = new RustIterator([1, 'a', 2, 'b', 3, 'c']);
      expect(numbers.all((x) => typeof x === 'number')).toBe(true);
      expect(mixed.all((x) => typeof x === 'number')).toBe(false);
      expect(mixed.all((x) => typeof x === 'string')).toBe(false);
      expect(new RustIterator([]).all(Boolean)).toBe(true);
    });
  });
  describe('.max/.min', () => {
    it('finds the max of an iterable', () => {
      const iter = new RustIterator([3, 4, 1, 5, 2]);
      expect(iter.max()).toBe(5);
      expect(new RustIterator([]).max()).toBe(undefined);
    });
    it('finds the min of an iterable', () => {
      const iter = new RustIterator([3, 4, 1, 5, 2]);
      expect(iter.min()).toBe(1);
      expect(new RustIterator([]).min()).toBe(undefined);
    });
    it('works on strings', () => {
      expect(new RustIterator(['c', 'a', 'b']).max()).toBe('c');
      expect(new RustIterator(['c', 'a', 'b']).min()).toBe('a');
    });
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
  describe('.inspect', () => {
    it('lazily inspects an iterable as a passthrough', () => {
      let count = 0;
      const iter = new RustIterator(['a', 'b', 'c']).inspect(() => count++);
      expect(count).toBe(0);
      expect([...iter]).toEqual(['a', 'b', 'c']);
      expect(count).toBe(3);
    });
  });
  describe('.scan', () => {
    it('returns an iterator that maintains an internal state to fold values', () => {
      const iter = new RustIterator([1, 2, 3]).scan(
        (acc, item) => acc ** item,
        2
      );
      expect([...iter]).toEqual([2, 4, 64]);
    });
  });
  describe('.flat', () => {
    it('returns an iterator over flattened values', () => {
      expect([...new RustIterator([1, [2, 3], [4, [5, 6]]]).flat()]).toEqual([
        1,
        2,
        3,
        4,
        [5, 6],
      ]);
    });
  });
});

describe('Special Methods', () => {
  describe('.sort', () => {
    it('returns a sorted iterator', () => {
      const iter = new RustIterator([3, 2, 1]).sort();
      expect([...iter]).toEqual([1, 2, 3]);
    });
    it('accepts a comparison function', () => {
      const iter = new RustIterator([3, 2, 1]).sort((a, b) => b - a);
      expect([...iter]).toEqual([3, 2, 1]);
    });
  });
});

describe('PeekableRustIterator', () => {
  describe('.peekable', () => {
    it('returns a new PeekableRustIterator from RustIterator', () => {
      const iter = new RustIterator([1, 2, 3]).peekable();
      expect(iter).toBeInstanceOf(PeekableRustIterator);
    });
    it('returns self from PeekableRustIterator', () => {
      const iter = new PeekableRustIterator([1, 2, 3]);
      expect(iter.peekable()).toBe(iter);
    });
  });
  describe('.peek', () => {
    it('allows peeking', () => {
      const iter = new PeekableRustIterator([1, 2, 3]);
      expect(iter.peek()).toEqual({ value: 1, done: false });
      expect(iter.peek()).toEqual({ value: 1, done: false });
      expect(iter.next()).toEqual({ value: 1, done: false });
      expect(iter.peek()).toEqual({ value: 2, done: false });
      expect(iter.peek()).toEqual({ value: 2, done: false });
      expect(iter.next()).toEqual({ value: 2, done: false });
      expect(iter.peek()).toEqual({ value: 3, done: false });
      expect(iter.peek()).toEqual({ value: 3, done: false });
      expect(iter.next()).toEqual({ value: 3, done: false });
      expect(iter.peek()).toEqual({ value: undefined, done: true });
      expect(iter.peek()).toEqual({ value: undefined, done: true });
      expect(iter.next()).toEqual({ value: undefined, done: true });
    });
  });
});
