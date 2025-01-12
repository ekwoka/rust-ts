import { None, type Option, Some } from '@/option/Option'
import { Err, Ok } from '@/result/Result'

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
      expect(new Some(42).andThen((n) => new Some(String(n)))).toHaveProperty(
        'val',
        '42',
      )
    })
    it('Some::orElse', () => {
      expect(new Some(42).orElse(() => new Some('69'))).toHaveProperty(
        'val',
        42,
      )
    })
    it('None::andThen', () => {
      expect(new None().andThen(() => new Some('69'))).toBeInstanceOf(None)
    })
    it('None::orElse', () => {
      expect(new None().orElse(() => new Some('69'))).toHaveProperty(
        'val',
        '69',
      )
    })
  })
  describe('transforming', () => {
    it('Some::map', () => {
      expect(new Some(42).map((n) => String(n))).toHaveProperty('val', '42')
    })
    it('Some::mapOr', () => {
      expect(new Some(42).mapOr((n) => String(n), '69')).toBe('42')
    })
    it('Some::mapOrElse', () => {
      expect(
        new Some(42).mapOrElse(
          (n) => String(n),
          () => '69',
        ),
      ).toBe('42')
    })
    it('Some::flatten', () => {
      expect(new Some(new Some(42)).flatten()).toHaveProperty('val', 42)
      expect(new Some(new None()).flatten()).toBeInstanceOf(None)
      expect(new Some(42).flatten()).toHaveProperty('val', 42)
    })
    it('Some::okOr', () => {
      expect(new Some(42).okOr(new Error())).toBeInstanceOf(Ok)
      expect(new Some(42).okOr(new Error())).toHaveProperty('value', 42)
    })
    it('None::map', () => {
      expect(new None().map((n) => String(n))).toBeInstanceOf(None)
    })
    it('None::mapOr', () => {
      expect(new None().mapOr((n) => String(n), '69')).toBe('69')
    })
    it('None::mapOrElse', () => {
      expect(
        new None().mapOrElse(
          (n) => String(n),
          () => '69',
        ),
      ).toBe('69')
    })
    it('None::flatten', () => {
      expect(new None().flatten()).toBeInstanceOf(None)
    })
    it('None::okOr', () => {
      expect(new None().okOr(new Error())).toBeInstanceOf(Err)
      expect(new None().okOr(new Error())).toHaveProperty('error', new Error())
    })
  })
  describe('inspection', () => {
    it('Some::inspect', () => {
      let val: null | number = null
      expect(
        new Some(42).inspect((v) => {
          val = v
        }),
      ).toBeInstanceOf(Some)
      expect(val).toBe(42)
    })
    it('None::inspect', () => {
      let val: null | number = null
      expect(
        new None().inspect((v) => {
          val = v
        }),
      ).toBeInstanceOf(None)
      expect(val).toBeNull()
    })
  })
})
