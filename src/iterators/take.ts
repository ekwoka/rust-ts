export function* take<T>(iterable: IterableIterator<T> | Iterable<T>, n: number) {
    const iter = iterable[Symbol.iterator]();
    while (n--)
        yield iter.next().value;
}