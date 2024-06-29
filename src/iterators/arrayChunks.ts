export function* arrayChunks<T, N extends number>(
  iter: Iterable<T>,
  size?: N,
): Generator<ChunkedArray<T, N>, void, undefined> {
  let chunk: T[] = []
  for (const item of iter) {
    chunk.push(item)
    if (chunk.length === (size ?? 1)) {
      yield chunk as ChunkedArray<T, N>
      chunk = []
    }
  }
  if (chunk.length) yield chunk as ChunkedArray<T, N>
}

export type ChunkedArray<T, N extends number> =
  | (Array<T> & { length: N })
  | never
