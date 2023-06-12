import { sort } from '@/iterators/sort';

describe('sort', () => {
  it('sorts an iterable', () => {
    const iter = sort([3, 2, 1], (a, b) => a - b);
    expect([...iter]).toEqual([1, 2, 3]);
  });
  it('sorts as it yields', () => {
    const compare = vi.fn((a, b) => a - b);
    const iter = sort([3, 1, 2], compare);
    expect(compare).toBeCalledTimes(0);
    expect(iter.next().value).toBe(1);
    expect(compare).toBeCalledTimes(2);
    expect(iter.next().value).toBe(2);
    expect(compare).toBeCalledTimes(3);
    expect(iter.next().value).toBe(3);
    expect(compare).toBeCalledTimes(3);
  });
  it('defaults to lexographical comparison', () => {
    expect([...sort(['a', 'c', 'b'])]).toEqual(['a', 'b', 'c']);
    expect([...sort([5, 40, 100])]).toEqual([5, 40, 100]);
  });
});
