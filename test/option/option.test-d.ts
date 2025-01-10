import { None, type Option, Some } from '@/option/Option'

describe('Option Types', () => {
  expectTypeOf(new Some(42)).toMatchTypeOf<Option<number>>()
  expectTypeOf(new None()).toMatchTypeOf<Option<number>>()
  expectTypeOf(new Some(42).andThen((n) => new Some(String(n)))).toMatchTypeOf<
    Option<string>
  >()
  expectTypeOf(
    (new Some(42) as Option<number>).map((n) => String(n)),
  ).toMatchTypeOf<Option<string>>()
  expectTypeOf(
    (new Some(42) as Option<number>).andThen(
      (n) => new Some(String(n)) as Option<string>,
    ),
  ).toMatchTypeOf<Option<string>>()
  expectTypeOf(new Some(42).map((n) => BigInt(n))).toMatchTypeOf<Some<bigint>>()
  expectTypeOf(
    (new Some(new Some(42)) as Option<Option<number>>).flatten(),
  ).toMatchTypeOf<Option<number>>()
  expectTypeOf(
    (new Some(new Some(42)) as Option<Some<number>>).flatten(),
  ).toMatchTypeOf<Option<number>>()
  expectTypeOf(
    (new Some(new None()) as Option<None>).flatten(),
  ).toMatchTypeOf<None>()
  expectTypeOf(
    (new Some(new Some(42)) as Some<Option<number>>).flatten(),
  ).toMatchTypeOf<Option<number>>()
  expectTypeOf(new Some(new Some(42)).flatten()).toMatchTypeOf<Some<number>>()
  expectTypeOf(new Some(new None()).flatten()).toMatchTypeOf<None>()
  expectTypeOf(new None().flatten()).toMatchTypeOf<None>()
})
