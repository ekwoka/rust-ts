export function* window<T>(iter: Iterable<T>, size: number) {
  let buffer: T[] = [];
  for (const x of iter) {
    if (buffer.length === size) buffer = buffer.slice(1);
    buffer.push(x);
    if (buffer.length === size) yield buffer;
  }
}
