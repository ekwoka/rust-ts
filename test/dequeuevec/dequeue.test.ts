import { DequeueVec } from '@/dequeuevec/index';

describe('DequeueVec', () => {
  it('stores an array', () => {
    const a = [1, 2, 3];
    const d = new DequeueVec(a);
    expect(d.buffer).toEqual(a);
    expect(d.first()).toEqual(1);
    expect(d.last()).toEqual(3);
  });
  it('can push', () => {
    const d = new DequeueVec(3);
    d.push(4);
    expect(d.buffer).toEqual([4, undefined, undefined]);
    expect(d.first()).toEqual(4);
    expect(d.last()).toEqual(4);
  });
  it('can pop', () => {
    const d = new DequeueVec([1, 2, 3]);
    expect(d.pop()).toEqual(3);
    expect(d.buffer).toEqual([1, 2, undefined]);
    expect(d.first()).toEqual(1);
    expect(d.last()).toEqual(2);
  });
  it('can unshift', () => {
    const d = new DequeueVec(3);
    d.unshift(4);
    expect(d.buffer).toEqual([undefined, undefined, 4]);
    expect(d.first()).toEqual(4);
    expect(d.last()).toEqual(4);
  });
});
