import { RustIterator } from './RustIterator.js';

export function* rangeGen(start = 0, end = Infinity, step = 1) {
  for (let i = start; i <= end; i += step) yield i;
}

const rangeRegex = /^(\d*)\.\.(=?)(\d*)$/;
export const r = ([str]: TemplateStringsArray) => {
  const matches = str.match(rangeRegex);
  if (!matches) throw new Error(`Invalid range: ${str}`);
  const [_, start, inclusive, end] = matches;
  return range(+(start || 0), +(end || Infinity) - (inclusive ? 0 : 1));
};

export const range = (start = 0, end = Infinity, step = 1) =>
  new RustIterator(rangeGen(start, end, step));
