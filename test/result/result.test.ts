import { Err, Ok, Result, isErr, isOk } from '@/result/Result';

describe('Result', () => {
  it('should be able to create an Ok result', () => {
    const result = new Ok(42);
    expect(result.value).toEqual(42);
  });
  it('should be able to create an Err result', () => {
    const result = new Err(42);
    expect(result.error).toEqual(42);
  });
  it('can test if a result is Ok', () => {
    const okie = new Ok(42);
    expect(isOk(okie)).toEqual(true);
    expect(okie.isOk()).toEqual(true);
    const err = new Err(42);
    expect(isOk(err)).toEqual(false);
    expect(err.isOk()).toEqual(false);
  });
  it('can test if a result is Err', () => {
    const okie = new Ok(42);
    expect(isErr(okie)).toEqual(false);
    expect(okie.isErr()).toEqual(false);
    const err = new Err(42);
    expect(isErr(err)).toEqual(true);
    expect(err.isErr()).toEqual(true);
  });
  describe('unwrap', () => {
    it('can unwrap an Ok result or throw Err', () => {
      const okie = new Ok(42);
      expect(okie.unwrap()).toEqual(42);
      const err = new Err(new Error('42'));
      expect(() => err.unwrap()).toThrow(new Error('42'));
    });
    it('can unwrap an Err result', () => {
      const okie = new Ok(42);
      expect(() => okie.unwrapErr()).toThrow(
        new Error('called `Result.unwrapErr()` on an `Ok` value')
      );
      const err = new Err(new Error('42'));
      expect(err.unwrapErr()).toEqual(new Error('42'));
    });
    it('can unwrapOr use default', () => {
      expect(new Ok(42).unwrapOr(69)).toEqual(42);
      expect(new Err(42).unwrapOr(69)).toEqual(69);
    });
  });
  describe('control flow', () => {
    it('can chain andThen', () => {
      let result: Result<number, number> = new Ok(42);
      result = result.andThen((value) => new Ok(value + 1));
      expect(result.unwrap()).toEqual(43);
      result = result.andThen((value) => new Err(value + 1));
      expect(result.unwrapErr()).toEqual(44);
      result = result.andThen((value) => new Ok(value + 1));
      expect(result.unwrapErr()).toEqual(44);
      result = result.andThen((value) => new Err(value + 1));
      expect(result.unwrapErr()).toEqual(44);
    });
    it('can chain orElse', () => {
      let result: Result<number, number> = new Err(42);
      result = result.orElse((value) => new Ok(value + 1));
      expect(result.unwrap()).toEqual(43);
      result = result.orElse((value) => new Err(value + 1));
      expect(result.unwrap()).toEqual(43);
    });
  });
  describe('map', () => {
    it('can map Ok', () => {
      const okie: Result<number, number> = new Ok(42);
      expect(okie.map((value) => value + 1).unwrap()).toEqual(43);
      const error: Result<number, number> = new Err(42);
      expect(error.map((value) => value + 1).unwrapErr()).toEqual(42);
    });
    it('can mapErr', () => {
      const okie: Result<number, number> = new Ok(42);
      expect(okie.mapErr((value) => value + 1).unwrap()).toEqual(42);
      const error: Result<number, number> = new Err(42);
      expect(error.mapErr((value) => value + 1).unwrapErr()).toEqual(43);
    });
    it('can mapOr', () => {
      const okie = new Ok(42);
      expect(okie.mapOr((value) => value + 1, 69)).toEqual(43);
      const error = new Err(42);
      expect(error.mapOr((value) => value + 1, 69)).toEqual(69);
    });
    it('can mapOrElse', () => {
      const okie = new Ok(42);
      expect(
        okie.mapOrElse(
          (value) => value + 1,
          (value) => value - 1
        )
      ).toEqual(43);
      const error = new Err(42);
      expect(
        error.mapOrElse(
          (value) => value + 1,
          (value) => value - 1
        )
      ).toEqual(41);
    });
  });
});
