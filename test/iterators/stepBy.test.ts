import { stepBy } from '@/iterators/stepBy';

describe('stepBy', () => {
  it('steps by n', () => {
    const iter = stepBy([1, 2, 3, 4, 5, 6, 7, 8], 2);
    expect(iter.next().value).toBe(1);
    expect(iter.next().value).toBe(3);
    expect(iter.next().value).toBe(5);
    expect(iter.next().value).toBe(7);
    expect(iter.next().done).toBe(true);
  });
});
