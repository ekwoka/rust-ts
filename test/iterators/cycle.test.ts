import { cycle } from '@/iterators/cycle';

describe('cycle', () => {
  it('infinitely loops an iterable', () => {
    const iter = cycle([1, 2, 3]);
    for (let i = 0; i < 10; i++) {
      expect(iter.next().value).toBe(1);
      expect(iter.next().value).toBe(2);
      expect(iter.next().value).toBe(3);
    }
  });
});
