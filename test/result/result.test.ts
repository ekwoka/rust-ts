import { Err, Ok, isErr, isOk } from '@/result/Result';

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
});
