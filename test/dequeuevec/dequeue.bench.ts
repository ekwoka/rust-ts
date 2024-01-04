import { DequeueVec } from '@/dequeuevec/index';
import { bench } from 'vitest';

describe('As a Queue', () => {
  bench('DequeueVec', () => {
    const d = new DequeueVec<number>(1000);
    for (let i = 0; i < 1000; i++) d.push(i);
    for (let i = 0; i < 1000; i++) d.shift();
  });
  bench('Array', () => {
    const d = new Array<number>(1000);
    for (let i = 0; i < 1000; i++) d.push(i);
    for (let i = 0; i < 1000; i++) d.shift();
  });
});
describe('As a Stack', () => {
  bench('DequeueVec', () => {
    const d = new DequeueVec<number>(1000);
    for (let i = 0; i < 1000; i++) d.push(i);
    for (let i = 0; i < 1000; i++) d.pop();
  });
  bench('Array', () => {
    const d = new Array<number>(1000);
    for (let i = 0; i < 1000; i++) d.push(i);
    for (let i = 0; i < 1000; i++) d.pop();
  });
});
describe('All Head', () => {
  bench('DequeueVec', () => {
    const d = new DequeueVec<number>(1000);
    for (let i = 0; i < 1000; i++) d.unshift(i);
    for (let i = 0; i < 1000; i++) d.shift();
  });
  bench('Array', () => {
    const d = new Array<number>(1000);
    for (let i = 0; i < 1000; i++) d.unshift(i);
    for (let i = 0; i < 1000; i++) d.shift();
  });
});
