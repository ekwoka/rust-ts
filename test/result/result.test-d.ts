import { Err, Ok, Result } from '@/result/Result'

describe('Result Types', () => {
  expectTypeOf(new Ok(42)).toMatchTypeOf<Result<number, never>>()
  expectTypeOf(new Ok(42).andThen((n) => new Ok(String(n)))).toMatchTypeOf<
    Result<string, never>
  >()
  expectTypeOf(
    (new Ok(42) as Result<number, Error>).map((n) => String(n)),
  ).toMatchTypeOf<Result<string, Error>>()
  expectTypeOf(
    (new Ok(42) as Result<number, Error>).andThen(
      (n) => new Ok(String(n)) as Result<string, string>,
    ),
  ).toMatchTypeOf<Result<string, Error | string>>()
  expectTypeOf(new Ok(42).map((n) => BigInt(n))).toMatchTypeOf<Ok<bigint>>()
  expectTypeOf(
    (new Ok(new Ok(42)) as Result<Result<number, string>, Error>).flatten(),
  ).toMatchTypeOf<Result<number, string | Error>>()
  expectTypeOf(
    (new Ok(new Ok(42)) as Result<Ok<number>, Error>).flatten(),
  ).toMatchTypeOf<Result<number, Error>>()
  expectTypeOf(
    (
      new Ok(new Err(new SyntaxError())) as Result<Err<SyntaxError>, Error>
    ).flatten(),
  ).toMatchTypeOf<Err<Error | SyntaxError>>()
  expectTypeOf(
    (new Ok(new Ok(42)) as Ok<Result<number, string>>).flatten(),
  ).toMatchTypeOf<Result<number, string>>()
  expectTypeOf(new Ok(new Ok(42)).flatten()).toMatchTypeOf<Ok<number>>()
  expectTypeOf(new Ok(new Err(42)).flatten()).toMatchTypeOf<Err<number>>()
  expectTypeOf(new Err(new Ok(42)).flatten()).toMatchTypeOf<Err<Ok<number>>>()
})
