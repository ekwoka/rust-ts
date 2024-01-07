import { VecDequeue } from '@/vecdequeue';
import { bench } from 'vitest';

describe('As a Queue', () => {
  bench('VecDequeue', () => {
    const d = new VecDequeue<number>(0);
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 1000; i++) d.push(i);
      for (let i = 0; i < 1000; i++) d.shift();
    }
  });
  bench('Array', () => {
    const d = new Array<number>(0);
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 1000; i++) d.push(i);
      for (let i = 0; i < 1000; i++) d.shift();
    }
  });
});
describe('As a Stack', () => {
  bench('VecDequeue', () => {
    const d = new VecDequeue<number>(0);
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 1000; i++) d.push(i);
      for (let i = 0; i < 1000; i++) d.pop();
    }
  });
  bench('Array', () => {
    const d = new Array<number>(0);
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 1000; i++) d.push(i);
      for (let i = 0; i < 1000; i++) d.pop();
    }
  });
});
describe('All Head', () => {
  bench('VecDequeue', () => {
    const d = new VecDequeue<number>(0);
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 1000; i++) d.unshift(i);
      for (let i = 0; i < 1000; i++) d.shift();
    }
  });
  bench('Array', () => {
    const d = new Array<number>(0);
    for (let i = 0; i < 4; i++) {
      for (let i = 0; i < 1000; i++) d.unshift(i);
      for (let i = 0; i < 1000; i++) d.shift();
    }
  });
});
