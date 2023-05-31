import { map } from '@/iterators/map';

describe('map', () => {
  it('maps an iterable', () =>
    expect([...map([1, 2, 3], (x) => x * 2)]).toEqual([2, 4, 6]));
  it('maps into new type', () =>
    expect([...map([1, 2, 3], (x) => `${x}`)]).toEqual(['1', '2', '3']));
});
