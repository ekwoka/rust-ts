export function* map<T, S = T>(iterable: Iterable<T> | IterableIterator<T>, f: (val: T) => S) {
    for (const x of iterable)
        yield f(x);
}