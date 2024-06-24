export const reverse = function* <T>(iter: Iterable<T>) {
  const arr = [...iter]
  for (let i = arr.length - 1; i >= 0; i--) yield arr[i]
}
