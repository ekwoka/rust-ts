import { None, type Option, Some } from '@/option/Option'

describe('Option', () => {
  describe('identity', () => {
    it('isSome', () => {
      expect(new Some(42).isSome()).toBe(true)
      expect(new None().isSome()).toBe(false)
    })
    it('isNone', () => {
      expect(new Some(42).isNone()).toBe(false)
      expect(new None().isNone()).toBe(true)
    })
  })
  describe('unwrapping', () => {
    it('Some::unwrap', () => {
      expect(new Some(42).unwrap()).toBe(42)
    })
    it('Some::unwrapOr', () => {
      expect(new Some(42).unwrapOr(0)).toBe(42)
    })
    it('Some::unwrapOrElse', () => {
      expect(new Some(42).unwrapOrElse(() => 0)).toBe(42)
    })
    it('Some::expect', () => {
      expect(new Some(42).expect('Failed to unwrap value')).toBe(42)
    })
    it('None::unwrap', () => {
      expect(() => new None().unwrap()).toThrowError()
    })
    it('None::unwrapOr', () => {
      expect(new None().unwrapOr(69)).toBe(69)
    })
    it('None::unwrapOrElse', () => {
      expect(new None().unwrapOrElse(() => 69)).toBe(69)
    })
    it('None::expect', () => {
      expect(() => new None().expect('to be something')).toThrowError(
        `Error unwrapping None. Expected to be something`,
      )
    })
  })
  describe('control flow', () => {
    it('Some::andThen', () => {
      expect(new Some(42).andThen((n) => new Some(String(n))).val).toBe('42')
    })
    it('Some::orElse', () => {
      expect(new Some(42).orElse(() => new Some('69')).val).toBe(42)
    })
    it('None::andThen', () => {
      expect(new None().andThen(() => new Some('69')).isNone()).toBe(true)
    })
    it('None::orElse', () => {
      expect(new None().orElse(() => new Some('69')).val).toBe('69')
    })
  })
})
