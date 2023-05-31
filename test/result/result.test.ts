import { Err, Ok, isErr, isOk } from '@/result/result';

describe('Result', () => {
  it('should be able to create an Ok result', () => {
    const result = Ok(42);
    expect(result.value).toEqual(42);
  });
  it('should be able to create an Err result', () => {
    const result = Err(42);
    expect(result.error).toEqual(42);
  });
  it('can test if a result is Ok', () => {
    const okie = Ok(42);
    expect(isOk(okie)).toEqual(true);
    const err = Err(42);
    expect(isOk(err)).toEqual(false);
  });
  it('can test if a result is Err', () => {
    const okie = Ok(42);
    expect(isErr(okie)).toEqual(false);
    const err = Err(42);
    expect(isErr(err)).toEqual(true);
  });
});
