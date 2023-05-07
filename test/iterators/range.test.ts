import { r, range } from '@/iterators/range';

describe('range', () => {
  it('returns an iterator', () => {
    const rangeIterator = range(1, 5);
    expect(rangeIterator).toBeInstanceOf(Object);
    expect(rangeIterator[Symbol.iterator]).toBeInstanceOf(Function);
    expect(rangeIterator[Symbol.iterator]()).toBe(rangeIterator);
  });
  it('iterates from start to end (inclusive)', () =>
    expect([...range(1, 5)]).toEqual([1, 2, 3, 4, 5]));
  it('accepts a step parameter', () =>
    expect([...range(1, 5, 2)]).toEqual([1, 3, 5]));
  it('iterates 0 times for invalid ranges', () =>
    expect([...range(5, 1)]).toEqual([]));
  it('iterates infinitely when no end is provided', () => {
    const iter = range(1);
    for (let i = 0; i < 500; i++) expect(iter.next().value).toBe(i + 1);
  });
});
describe('r tagged template', () => {
  it('parses tagged template', () =>
    expect([...r`1..5`]).toEqual([1, 2, 3, 4]));
  it('parses inclusive ranges', () =>
    expect([...r`1..=5`]).toEqual([1, 2, 3, 4, 5]));
  it('defaults to 0 start', () => expect([...r`..5`]).toEqual([0, 1, 2, 3, 4]));
  it('iterates infinitely when no end is provided', () => {
    const iter = r`1..`;
    for (let i = 0; i < 500; i++) expect(iter.next().value).toBe(i + 1);
  });
  it('counts from 0 to Infinity with just `..`', () => {
    const iter = r`..`;
    for (let i = 0; i < 500; i++) expect(iter.next().value).toBe(i);
  });
});
