import { take } from '@/iterators/take';

describe('take', () => {
  it('takes from an iterable', () =>
    expect([...take([1, 2, 3], 2)]).toEqual([1, 2]));
});
