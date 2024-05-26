import { Dec } from '../types/utils';

export function* arrayChunks<T, N extends size = 1>(
  iter: Iterable<T>,
  size?: N,
): Generator<ChunkedArray<T, N>, void, undefined> {
  let chunk: T[] = [];
  for (const item of iter) {
    chunk.push(item);
    if (chunk.length === (size ?? 1)) {
      yield chunk as ChunkedArray<T, N>;
      chunk = [];
    }
  }
  if (chunk.length) yield chunk as ChunkedArray<T, N>;
}

export type size = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type ChunkedArray<T, N extends size = 1> =
  N extends 0 ? [] : [T, ...ChunkedArray<T, Dec[N]>];
