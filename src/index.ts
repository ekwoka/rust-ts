export {
  RustIterator,
  PeekableRustIterator,
  filter,
  flat,
  map,
  r,
  range,
  scan,
  stepBy,
  take,
  window,
  zip,
} from './iterators/index.js';

export { Ok, Err, isOk, isErr, Try, TryAsync } from './result/index.js';
export type { Result } from './result/index.js';
