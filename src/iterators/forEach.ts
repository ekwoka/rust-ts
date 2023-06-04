export const forEach = <T>(iter: Iterable<T>, f: (val: T) => void) => {
  for (const x of iter) f(x);
};
