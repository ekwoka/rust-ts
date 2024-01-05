import { DequeueVec } from '@/dequeuevec/index';

describe('DequeueVec', () => {
  it('stores an array', () => {
    const a = [1, 2, 3];
    const d = new DequeueVec(a);
    expect(d.buffer).toEqual(a);
    expect(d.first()).toEqual(1);
    expect(d.last()).toEqual(3);
  });
  it('doubles in size when full to make room for new values', () => {
    const d = new DequeueVec(3);
    d.push(1);
    d.push(2);
    d.push(3);
    d.push(4);
    expect(d.buffer).toEqual([1, 2, 3, 4, undefined, undefined]);
    expect(d.first()).toEqual(1);
    expect(d.last()).toEqual(4);
  });
  it('can move wrapped items into extended memory space', () => {
    const d = new DequeueVec(3);
    d.push(1);
    d.push(2);
    d.push(3);
    expect(d.buffer).toEqual([1, 2, 3]);
    d.shift();
    expect(d.buffer).toEqual([undefined, 2, 3]);
    d.push(4);
    expect(d.buffer).toEqual([4, 2, 3]);
    d.push(5);
    expect(d.buffer).toEqual([undefined, 2, 3, 4, 5, undefined]);
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
  it('is iterable', () => {
    const buff = new DequeueVec([1, 2, 3]);
    const iter = buff[Symbol.iterator]();
    expect(iter.next()).toEqual({ value: 1, done: false });
    expect(iter.next()).toEqual({ value: 2, done: false });
    expect(iter.next()).toEqual({ value: 3, done: false });
    expect(iter.next()).toEqual({ value: undefined, done: true });
    expect([...buff]).toEqual([1, 2, 3]);
  });
  it('can become RustIterator', () => {
    const buff = new DequeueVec([1, 2, 3]);
    expect(
      buff
        .toIter()
        .map((v) => v * 2)
        .collect(),
    ).toEqual([2, 4, 6]);
  });
  it('iterates properly around the circular memory', () => {
    const buff = new DequeueVec([1, 2, 3]);
    buff.shift();
    expect(buff.tail).toBe(0);
    buff.push(4);
    buff.push(5);
    buff.push(6);
    expect(buff.buffer).toEqual([undefined, 2, 3, 4, 5, 6]);
    expect([...buff]).toEqual([2, 3, 4, 5, 6]);
    buff.push(7);
    expect(buff.buffer).toEqual([7, 2, 3, 4, 5, 6]);
    expect([...buff]).toEqual([2, 3, 4, 5, 6, 7]);
  });
});
describe('DequeueVec.from', () => {
  it('can be created from an array', () => {
    const a = [1, 2, 3];
    const d = DequeueVec.from(a);
    expect(d.buffer).toEqual(a);
    expect(d.first()).toEqual(1);
    expect(d.last()).toEqual(3);
  });
  it('can be created from options object', () => {
    const d = DequeueVec.from({ length: 3 });
    expect(d.buffer).toEqual([undefined, undefined, undefined]);
    expect(d.first()).toEqual(undefined);
    expect(d.last()).toEqual(undefined);
  });
  it('can be created from an object with a mapper', () => {
    const d = DequeueVec.from({ length: 3 }, (v, i) => v + i);
    expect(d.buffer).toEqual([0, 2, 4]);
    expect(d.first()).toEqual(0);
    expect(d.last()).toEqual(4);
  });
});
