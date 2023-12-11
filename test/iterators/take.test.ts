import { take, takeWhile } from '@/iterators/take';

describe('take', () => {
  it('takes from an iterable', () =>
    expect([...take([1, 2, 3], 2)]).toEqual([1, 2]));
});
describe('takeWhile', () => {
  it('takes from an iterable while a predicate is passing', () =>
    expect([...takeWhile([1, 2, 3, 4, 5, 6], (v) => v <= 4)]).toEqual([
      1, 2, 3, 4,
    ]));
});
