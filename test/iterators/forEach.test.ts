import { forEach } from '@/iterators/forEach';

describe('forEach', () => {
  it('calls a closure for each element in the iterable', () => {
    let count = 0;
    let values = '';
    const closure = (val: string) => {
      count++;
      values += val;
    };
    forEach(['a', 'b', 'c'], closure);
    expect(count).toBe(3);
    expect(values).toBe('abc');
  });
});
