import { Err, Ok, Result, Try, TryAsync, isErr, isOk } from '@/result/Result'

describe('Result', () => {
  it('should be able to create an Ok result', () => {
    const result = new Ok(42)
    expect(result.unwrap()).toEqual(42)
  })
  it('should be able to create an Err result', () => {
    const result = new Err(42)
    expect(result.unwrapErr()).toEqual(42)
  })
  it('can test if a result is Ok', () => {
    const okie = new Ok(42)
    expect(isOk(okie)).toEqual(true)
    expect(okie.isOk()).toEqual(true)
    const err = new Err(42)
    expect(isOk(err)).toEqual(false)
    expect(err.isOk()).toEqual(false)
  })
  it('can test if a result is Err', () => {
    const okie = new Ok(42)
    expect(isErr(okie)).toEqual(false)
    expect(okie.isErr()).toEqual(false)
    const err = new Err(42)
    expect(isErr(err)).toEqual(true)
    expect(err.isErr()).toEqual(true)
  })
  it('can Try an operation', () => {
    expect(new Ok(42)).toEqual(new Ok(42))
    expect(Try(() => JSON.parse('{a: 1}')).unwrapErr().message).toContain(
      "Expected property name or '}' in JSON at position 1",
    )
  })
  it('can Try an async operation', async () => {
    expect(await TryAsync(() => Promise.resolve(42))).toEqual(new Ok(42))
    expect(
      (await TryAsync(() => Promise.reject(JSON.parse('{a: 1}')))).unwrapErr()
        .message,
    ).toContain("Expected property name or '}' in JSON at position 1")
  })
  describe('unwrap', () => {
    it('can unwrap an Ok result or throw Err', () => {
      const okie = new Ok(42)
      expect(okie.unwrap()).toEqual(42)
      const err = new Err(new Error('42'))
      expect(() => err.unwrap()).toThrow(new Error('42'))
    })
    it('can unwrap an Err result', () => {
      const okie = new Ok(42)
      expect(() => okie.unwrapErr()).toThrow(
        new Error('called `Result.unwrapErr()` on an `Ok` value'),
      )
      const err = new Err(new Error('42'))
      expect(err.unwrapErr()).toEqual(new Error('42'))
    })
    it('can unwrapOr use default', () => {
      expect(new Ok(42).unwrapOr(69)).toEqual(42)
      expect(new Err(42).unwrapOr(69)).toEqual(69)
    })
    it('can unwrapOrElse run a closure', () => {
      expect(
        (new Ok(42) as Result<number, number>).unwrapOrElse(() => 69),
      ).toEqual(42)
      expect(
        (new Err(42) as Result<number, number>).unwrapOrElse(() => 69),
      ).toEqual(69)
    })

    it('can indicate why result is epected to be Ok', () => {
      expect(new Ok(42).expect('value is hardcoded')).toEqual(42)
      expect(() => new Err(42).expect('value is hardcoded')).toThrow(
        /value is hardcoded/,
      )
    })
  })
  describe('control flow', () => {
    it('can chain andThen', () => {
      let result: Result<number, number> = new Ok(42)
      result = result.andThen((value) => new Ok(value + 1))
      expect(result).toEqual(new Ok(43))
      result = result.andThen((value) => new Err(value + 1))
      expect(result).toEqual(new Err(44))
      result = result.andThen((value) => new Ok(value + 1))
      expect(result).toEqual(new Err(44))
      result = result.andThen((value) => new Err(value + 1))
      expect(result).toEqual(new Err(44))
    })
    it('can chain orElse', () => {
      let result: Result<number, number> = new Err(42)
      result = result.orElse((value) => new Ok(value + 1))
      expect(result).toEqual(new Ok(43))
      result = result.orElse((value) => new Err(value + 1))
      expect(result).toEqual(new Ok(43))
    })
  })
  describe('map', () => {
    it('can map Ok', () => {
      const okie: Result<number, number> = new Ok(42)
      expect(okie.map((value) => value + 1)).toEqual(new Ok(43))
      const error: Result<number, number> = new Err(42)
      expect(error.map((value) => value + 1)).toEqual(new Err(42))
    })
    it('can mapErr', () => {
      const okie: Result<number, number> = new Ok(42)
      expect(okie.mapErr((value) => value + 1)).toEqual(new Ok(42))
      const error: Result<number, number> = new Err(42)
      expect(error.mapErr((value) => value + 1)).toEqual(new Err(43))
    })
    it('can mapOr', () => {
      const okie = new Ok(42)
      expect(okie.mapOr((value) => value + 1, 69)).toEqual(43)
      const error = new Err(42)
      expect(error.mapOr((value) => value + 1, 69)).toEqual(69)
    })
    it('can mapOrElse', () => {
      const okie = new Ok(42)
      expect(
        okie.mapOrElse(
          (value) => value + 1,
          (value) => value - 1,
        ),
      ).toEqual(43)
      const error = new Err(42)
      expect(
        error.mapOrElse(
          (value) => value + 1,
          (value) => value - 1,
        ),
      ).toEqual(41)
    })
  })

  describe('special methods', () => {
    it('inspects the Ok value', () => {
      const closure = vi.fn()
      const okie = new Ok(42)
      okie.inspect(closure)
      expect(closure).toHaveBeenCalledOnce()
      expect(closure).toHaveBeenCalledWith(42)
      const err = new Err(42)
      err.inspect(closure)
      expect(closure).toHaveBeenCalledOnce()
    })
    it('inspects the Err value', () => {
      const closure = vi.fn()
      const okie: Result<number, number> = new Ok(42)
      okie.inspectErr(closure)
      expect(closure).toHaveBeenCalledTimes(0)
      const err: Result<number, number> = new Err(42)
      err.inspectErr(closure)
      expect(closure).toHaveBeenCalledOnce()
      expect(closure).toHaveBeenCalledWith(42)
    })
  })
})
