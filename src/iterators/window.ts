import { ChunkedArray, size } from './arrayChunks'

export function* window<T, S extends size = 1>(iter: Iterable<T>, size: S) {
  let buffer: T[] = []
  for (const x of iter) {
    if (buffer.length === size) buffer = buffer.slice(1)
    buffer.push(x)
    if (buffer.length === size) yield buffer as ChunkedArray<T, S>
  }
}
