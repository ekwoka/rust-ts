import '@/prelude.ts'
import { RustIterator } from '@/iterators/RustIterator'
describe('Prelude', () => {
  it('creates iter from Array', () => {
    expect([1, 2, 3].iter()).toBeInstanceOf(RustIterator)
    expect(
      [1, 2, 3]
        .iter()
        .map((n) => n ** 2)
        .collect(),
    ).toEqual([1, 4, 9])
  })
  it('creates iter from String', () => {
    expect('123'.iter()).toBeInstanceOf(RustIterator)
    expect(
      '123'
        .iter()
        .map(Number)
        .map((n) => n ** 2)
        .collect(),
    ).toEqual([1, 4, 9])
  })
  it('creates iter from Set', () => {
    expect(new Set([1, 2, 3]).iter()).toBeInstanceOf(RustIterator)
    expect(
      new Set([1, 2, 3, 3])
        .iter()
        .map((n) => n ** 2)
        .collect(),
    ).toEqual([1, 4, 9])
  })
  it('creates iter from Map', () => {
    expect(
      new Map([
        ['foo', 'bar'],
        ['hello', 'world'],
      ]).iter(),
    ).toBeInstanceOf(RustIterator)
    expect(
      new Map([
        ['foo', 'bar'],
        ['hello', 'world'],
      ])
        .iter()
        .map(([k, v]) => `${k}=${v}`)
        .collect(),
    ).toEqual(['foo=bar', 'hello=world'])
  })
  it('creates iter from Generator', () => {
    const gen = function* () {
      yield 1
      yield 2
      yield 3
    }
    expect(gen().iter()).toBeInstanceOf(RustIterator)
    expect(
      gen()
        .iter()
        .map((n) => n ** 2)
        .collect(),
    ).toEqual([1, 4, 9])
  })
  it('creates iter from Iterator', () => {
    expect([1, 2, 3][Symbol.iterator]().iter()).toBeInstanceOf(RustIterator)
    expect(
      [1, 2, 3]
        [Symbol.iterator]()
        .iter()
        .map((n) => n ** 2)
        .collect(),
    ).toEqual([1, 4, 9])
  })
})
