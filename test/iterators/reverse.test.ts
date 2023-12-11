import { reverse } from '@/iterators/reverse';

describe('reverse', () => {
  it('should reverse an array', () => {
    expect([...reverse([1, 2, 3])]).toEqual([3, 2, 1]);
  });
  it('should reverse a string', () => {
    expect([...reverse('abc')]).toEqual(['c', 'b', 'a']);
  });
});
