import { PeekableRustIterator } from '@/iterators';

describe('takeWhilePeek', () => {
  it('should take while next passes predicate', () => {
    const peekable = new PeekableRustIterator([1, 2, 3, 4, 5]);
    const result = [...peekable.takeWhilePeek((val) => val < 4)];
    expect(result).toEqual([1, 2, 3]);
    expect(peekable.peek().value).toBe(4);
    expect(peekable.next().value).toBe(4);
  });
});
