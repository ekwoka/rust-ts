# Rust-TS: Clean Implementation of Various Rust Style Structs

[<img src="https://img.shields.io/npm/v/@ekwoka/rust-ts?label=%20&style=for-the-badge&logo=pnpm&logoColor=white">](https://www.npmjs.com/package/@ekwoka/rust-ts)
<img src="https://img.shields.io/npm/types/@ekwoka/rust-ts?label=%20&logo=typescript&logoColor=white&style=for-the-badge">
<img src="https://img.shields.io/npm/dt/@ekwoka/rust-ts?style=for-the-badge&logo=npm&logoColor=white&logo=npm&logoColor=white" >
[<img src="https://img.shields.io/bundlephobia/minzip/@ekwoka/rust-ts?style=for-the-badge&logo=esbuild&logoColor=white&logo=esbuild&logoColor=white">](https://bundlephobia.com/package/@ekwoka/rust-ts)
<img src="https://img.shields.io/badge/coverage-98%25-success?style=for-the-badge&logo=vitest&logoColor=white" alt="98% test coverage">

This package seeks to implement useful structs from Rust for use in TypeScript Projects.

At this time this includes

- Option Enum (mostly complete)
- Result Enum (mostly complete)
- Iterator (mostly complete)
- DequeueVec/CircularBuffer (partial)

There is also some progress made on an implementation for `Future` to allow Promises to be awaited as a property expression, and not only with the await keyword.

## Installation

```bash
pnpm add @ekwoka/rust-ts
```

## `Result<T,E>` and `Option<T>`

These two Enums in Rust are used to handle methods and functions that can error, by returning a `Result` variant, and those that can return nothing, by returning an `Option` variant.

Since these two do serve somewhat similar purposes, they also have fairly similar interfaces. This documentation will only lightly touch on the usage/benefits of these structs as a whole, but you can refer to materials on these structs in a Rust context for more info there.

### Result Variants

The `Result<T,E>` type is made up of two variants:

- `Ok<T>`: Indicates the action was successful, and contains the proper return value
- `Err<E>`: Indicates the action was not successful, and contains the error encountered.

A function can return a `Result<T,E>` type and then return both of these different objects based on what happens. These contain the same interface, with different behaviors, allowing a nice type safe and expressive handling of errors.

```ts
return decrypt(data)
  .map((item) => ({ statusCode: 200, body: item }))
  .unwrapOrElse((error) => ({ statusCode: 500, body: error }));
```

Here, `decrypt` returns a `Result` that indicates if the data could be properly decrypted, or an error if it fails to decrypt, and then the success condition and the error condition can be handled expressively to conform them into the same shape object, without needing statements or other behaviors.

This can be chained near endlessly, allowing a focus on the happy path, and deferring error handling, similar to `.then/.catch` but with better flow.

```ts
return decrypt(data)
  .andThen(JSON.tryParse)
  .andThen(Item.tryFrom)
  .map((item) => ({ statusCode: 200, body: item }))
  .unwrapOrElse((error) => ({ statusCode: 500, body: error }));
```

Here, similar to before, `decrypt` returns a `Result`, but now we pass the `Ok` values into other functions that also return `Result` variants (`JSON.tryParse` and `Item.tryFrom`). If `decrypt` is `Ok` then we try to parse it as JSON, if that is `Ok`, we try to validate it as an `Item`, and if that is okay, we return a `200` status.

If any of those is `Err` we return a `500` and the error info.

Now, the code can focus on the happy path, with the errors handled later.

Naturally, this makes a ton of sense to those familiar with Rust.

### Option Variants

The `Option<T>` type is made up of two variants:

- `Some<T>`: Indicates the presence of a value
- `None`: Indicates the lack of a value

This is similar to the `Result` variants, but instead of indicating success and error states, indicates the presence of a value or lack of a value. For example:

```ts
getUser(userID);
```

Is the id not matching to a user an error? Not really. Any kind of `find` action, something not being found is quite different from there being an error in the process of searching. So you can return an `Option` to indicate, in this case, the specified user may or may not exist.

```ts
return getUser(userID).orElse(createUser);
```

Here, we can get the user, or create it if it doesn't exist already, all in an expression that allows focusing on the happy path

### Usage

To use the `Result` and `Option` enums, you can simply import their appropriate Variant for your case and instantiate it as a class (except for `None` which is already instantiated as a constant instance)

```ts
import { Ok, Err } from '@ekwoka/rust-ts';

export const tryParseJSON = (data: string) => {
  // to handle thrown exceptions from native methods
  try {
    // if successful will return an `Ok`
    return new Ok(JSON.parse(data));
  } catch (e) {
    // if an error was thrown, will return an `Err`
    return new Err(e);
  }
};

// attempts to parse and logs the hello key to the console if it exists. Does nothing on an error
tryParseJSON('{"hello":"world"}')
  .map((data) => data.hello)
  .andThen(console.log);
```

While this pattern would allow your own methods to return `Err` and you can handle them and do transformations and pass back the modified `Result`, we would need to wrap other things that might `throw` exceptions to catch and convert them to `Err`.

As a utility, this package exposes `Try` and `TryAsync` to help wrap such methods to return a `Result` instead of throwing.

```ts
import { Some, None } from '@ekwoka/rust-ts'

export getUser = (userID: string) => {
  // checks the user list for a matching user object
  const maybeUser = users.find(user => user.id === userID)

  // if the user is found, return Some<User>
  if (maybeUser) return new Some(maybeUser)

  // if no user, return None
  return None
}

getUser(1).map(user => user.items)
```

> Note: None does not need to be instantiated with `new`. You just reuse the same instance for all `None` since they have no internal data of relevance. This also allows them to be directly compared `None === None` . You can import `none` to get the class constructor if there is reason to need unique `None` values, but this is not recommended.

`None` behaves a lot like `undefined` or `null` in JavaScript, but with actual methods similar to `Some` that allow it to be used expressively without separate statements or extra checks to handle the `None` case up front. This can allow `None` to propagate naturally through many operations.

In systems level languages`null` is different than what it is in JavaScript (it's a null pointer, and not a specific thing) so some value of `None` over `null` is lost in JavaScript, but the expressive handling of `Option` types is still a major boon.

### Typing Function Returns

To handle typing function signatures that return `Result` and `Option` types, you can import the `type` and use it in the type signature.

```ts
import type { Result, Option } from '@ekwoka/rust-ts';

declare const tryParse = (data: string) => Result<unknown, SyntaxError>;
declare const getUser = (userId: string) => Option<User>;
```

Naturally, `Ok<T>` and `Err<E>` implement `Result<T,E>` and `Some<T>` and `None` implement `Option<T>`

### API

These two structs are very similar in their APIs. They mostly feature the same methods, with almost matching semantics, but can vary slightly. This guide to the Methods will go over the methods once as if it is a single struct, and present the signatures for each, and any accompanying differences between the two where they exist.

Shared methods will be presented first, and struct specific will be at the end.

#### `constructor<T>(value: T)`

The constructors for these are all quite simple. They take in a value (for `Ok` and `Some`) or error (for `Err`) and store it internally, returning the object.

#### `unwrap(): T`

Returns the inner value for `Ok<T>` and `Some<T>`. Throws an error on `Err` and `None`.

This can be used safely after checks that handle `Err` and `None` cases. Otherwise, this throws an exception for attempting to `unwrap` and unsafe value. As such, using `unwrap` means that you as a developer need the inner value and have validated that it exists.

It is recommended to use `expect` instead of `unwrap` in many cases (or one of the following `unwrapOr` methods), which allows you to provide a message for why you as a developer EXPECT that the value is safe to unwrap, so others reading it can know.

#### `unwrapOr(defaultValue: T): T`

This returns the inner value for `Ok<T>` and `Some<T>` and otherwise returns the provided value in the case of `None` or `Err`.

#### `unwrapOrElse(op: (error: E) => T): T` (`Result`)

#### `unwrapOrElse(op: () => T): T` (`Option`)

Returns the inner value for `Ok<T>` and `Some<T>`, and otherwise calls the passed in callback and returns its value for `Err` and `None` types. When a `Result` is `Err`, the `Err` is passed to the callback.

#### `unwrapErr(): E` (`Result` only)

Returns the inner value of an `Err` and otherwise throws an exception.

#### `expect(message: string): T`

Returns the inner value for `Ok<T>` and `Some<T>`. Otherwise throws an exception.

This is, code wise, almost exactly the same as `unwrap`, and the semantic distinction is that the `message` value can inform other developers why the code is unsafely accessing the inner value.

```ts
const config = readFile('./config.toml').expect('Config file must be present for application to run');
```

The passed in message is a part of the exception thrown, but the message is not meant to be an error message. It is meant to explain why the unwrapping of the value should be safe. Think `this value is safe because <MESSAGE>`.

#### `andThen<U>(op: (value: T) => U): U | Err<E>` (`Result`)

#### `andThen<U>(op: (value: T) => U): U | None` (`Option`)

Calls the passed in callback with the inner value for `Ok<T>` and `Some<T>` types returning that callbacks return value, otherwise simply returns `this` for `Err` and `None` types.

This can be useful for performing a final action on valid types without unwrapping them, or to help with flattening values. For instance, passing an `Ok` inner value to another function that returns a `Result`, using `andThen` will prevent you from ending up `Result<<Result<T,E>, E2>` value.

#### `orElse<U>(op: (E) => U): U | Ok<T>` (`Result`)

#### `orElse<U>(op: () => U): U | Some<T>` (`Option`)

Similar to `andThen` but operates on `Err` and `None` values, calling the callback, and returning it's return type, or the `Ok` / `Some` variant.

#### `map<U>(op: (value: T) => U): Result<U, E>`

#### `map<U>(op: (value: T) => U): Option<U>`

Passes the inner value to the callback and uses the returned value as the inner value of a new struct for `Ok<T>` and `Some<T>` variants, and does nothing with `Err` and `None` variants.

This, among the other methods, indicates that `Result` and `Option` structs are Monads, that wrap an inner value and allow performing operations based on their internal values returning other structs of the same or similar types.

This is not unlike how `Promise` work in JavaScript, where `.then` and `.catch` operate on the resolved or rejected values of one `Promise` and return another `Promise` with a new inner value.

#### `mapErr<U>(op: (error: E) => U): Result<T, U>` (`Result` only)

Similar to the above `map` but operates only on the `Err<E>` internal value, and returning a new `Err<U>`, while returning the original `Ok<T>`.

#### `mapOr<U>(op: (value: T) => U, defaultValue: U): U`

This and the following `mapOrElse` run the callback (with provided inner value from `Ok` and `Some` variants) and then directly return the value, while providing an alternative default value in the case of `Err` or `None` variants.

This is not unlike chaining `.map.unwrapOr`.

#### `mapOrElse<U>(op: (value: T) => U, opErr: (error: E) => U): U` (`Result`)

#### `mapOrElse<U>(op: (value: T) => U, opNone: () => U): U` (`Option`)

Calls the first callback with the `Ok` or `Some` inner value if present, otherwise calls the second callback with the `Err` internal value or nothing for `Err` and `None` variants.

This is similar to chaining `.map.unwrapOrElse`. This signature is also similar to how `.then` works on `Promise` where the first callback handles resolved values, and the second handles rejected values.

#### `inspect(inspector: (value: T) => void): Result<T, E> | Option<T>`

Calls the `inspector` callback with the inner value of `Ok` and `Some` variants, and then returns the original `Result` or `Option`. As the name implies, this is a nice way to inspect the inner value in a method chain that might otherwise require multiple expressions to store an intermediary value and then inspect it and then continue processing. Most simply just used as `.inspect(console.log)`.

#### `inspectErr(inspector: (error: E) => void): Result<T, E>` (`Result` only)

The same as `inspect` but only calls the callback on `Err<E>` with the error value. Returns the original `Result` struct.

#### `flatten(): Result<I,IE> | Option<I>`

There can be cases where you might end up with nested `Result` or `Option` values, like `Result<Result<number, string>, Error>` or `Option<Option<string>>`.

Naturally, these can be annoying to deal with safely, especially in chains where the inner value could be a `Result<number, string>|number`.

This flattens these values. So a `Result<Result<number, string>|string, Error>` would become a `Result<number|string, string | Error>`.

The types here can get quite complicated to get to a point of actually being Type Safe, so expect that there could be issues in particularly complex types. The difficulty mainly comes from allowing a known type of `Ok<Ok<number>>` flatten to `Ok<number>` and not resolve to a `Result<number, never>`, which I just don't think is quite tackled yet. Most of the time you won't be operating on known `Ok` or `Err` variants, so this method should work with no type issues on `Result` and `Option` types.

### `Result` exclusive API

#### `isOk(): this is Ok<T>`

Returns `true` if the `Result<T, E>` is actually and `Ok<T>`, otherwise `false`

#### `isErr(): this is Err<E>`

Returns `true` if the `Result<T, E>` is actually and `Err<E>`, otherwise `false`

#### `ok(): Option<T>`

Returns a `Some<T>` in the event of the `Result<T,E>` being `Ok<T>`, otherwise returns `None` (for `Err<E>`)

### `Option` exclusive API

#### `isSome(): this is Some<T>`

Returns `true` if the `Option<T>` is `Some<T>` otherwise `false`

#### `isNone(): this is None`

Returns `true` if the `Option<T>` is, in fact, `None` otherwise `false`

#### `okOr<E>(error: E): Result<T, E>`

Returns an `Ok<T>` for `Some<T>` otherwise returns an `Err<E>` for `None` created from the passed in `error`.

## `RustIterator`

This is a simple and clean implementation of the `Iter` trait from Rust, named as `RustIterator` to avoid conflicts with the current abstract `Iterator` interface in TypeScript, or the upcoming `Iterator` interface in JavaScript.

Right now, iterators in JavaScript SUCK. They're really bad. You can call `next()` check if the iterator is `done` , do a `for..of` loop, or spread it into an `Array`. That's not a whole lot.

Doing more active work with iterable values is left to `TransformStream` implementations that are required to be `async` and involve a lot more work currently (though `compose` in Node and Bun makes it quite a bit easier). Or of course, just doing a bunch of loops, or resorting to the various `Array` methods, which can perform unnecessary work, consume more memory, and generally just be inefficient.

> Note: the `Array` methods will often be more performant than this `Iter` implementation. This is due in part both to the fact the `Array` methods are highly optimized in the native side of the runtimes, and that the implementations of native `Iterator` and `Generator` which this relies on are needlessly wasteful.
> There are still plenty of cases, especially with potentially infinite data, where this iterator implementation can reduce the total amount of work done. The main case would be in large lists, that will have many `map` and `filter` style operations but where you only want the first `n` values. the `Array` methods would need to `map` and `filter` the entire list, even if only `5` final values are used.

The main benefit of this `Iterator` implementation, is not performance over existing native alternatives, but in the breadth of operations offered for iterating over the data contained.

### `IterableIterator<T>`

`RustIterator<T>` implements both the `Iterable<T>` and `Iterator<T>` interfaces, which, by definition, means it implements `IterableIterator<T>`.

What this means is that you can use it in all cases where an `Iterable` or `Iterator` is needed, like in `for..of` loops, spreading into a list (`...`) or destructuring `[first, second] = iter`.

The following methods/properties are how these interfaces are implemented.

#### `next(): IteratorResult<T>`

Returns the next yielded value from the iterator as an `IteratorResult<T>`. This consumes one value of the upstream `Iterator`

```ts
interface IteratorResult<T> {
  done: boolean;
  value: T | undefined;
}
```

#### `done: Boolean`

Allows introspecting into whether the `Iterator` is capable of yielding new values.

> This does not consume any part of the `Iterator`, and as such does not actually KNOW if the `Iterator` is done, just indicates if the `Iterator` has previously completed. This means an `Iterator` with a `done` value of `false` may or may not actually have an additional value, but a `done` of `true` means the `Iterator` should not yield any new values.
> `Iterator` instances that were previously `done` can still yield new values (and mark themselves as not `done`) in the future, on a technical level. `RustIterator` instances will generally never actually do this, as nearly every method will return a fused iterator that will never again yield a new value.

#### `[Symbol.iterator](): RustIterator<T>`

Returns itself, as an `Iterator`.

This method, called with the well-known `Symbol` `@@iterator` is used internally when doing `Array` destructuring, spreading, or `for..of` looping over `Iterable` objects. This is all that is needed to implement the `Iterable` abstract interface.

In this case, the method simply returns the same `RustIterator` instance it is called on, not a distinct object.

> Checking `maybeIterator[Symbol.iterator]() === maybeIterator` is the most common way to check if an object is an `Iterator`, as all native `Iterator` implement `Iterable` and return themselves for this method. Checking for the existence of a `next` method is much less of a guarantee.

### `new RustIterator<T>(upstream: Iterable<T>)

Constructs a new `RustIterator` from an `Iterable`.

This will call the `@@iterator` method on the `Iterable` and store the returned `Iterator` internally. This will not otherwise consume any `Iterator` passed in. If the `Iterable` supplied, is an `Iterator` then consuming the `RustIterator` would consume that `Iterator`.

Creating a `RustIterator` from an upstream `RustIterator` will return a new `RustIterator` that wraps the previous, not simply the same `RustIterator`. It will not clone the values, or any other magic.

#### `nextChunk(n: number): IteratorResult<T[]>`

Returns an `IteratorResult` of an `Array` containing the next `n` values from the `Iterator`. If the `Iterator` yields less than `n` values, the `IteratorResult` will be marked `done` and only include all those values yielded up to `n`. There is no guarantee in this method that `n` values will be returned, just that no more than `n` will be returned.

### `new PeekableRustIterator<T>(upstream: Iteratable<T>)`

`PeekableRustIterator` is a special kind of `RustIterator` that enables special behavior to allow you to inspect the next value to be yielded by `next`, without consuming the `Iterator`.

#### `peek(): IteratorResult<T>`

Returns the `IteratorResult` that will next be yielded when calling `next`. This can allow the developer to check the next value, and change course, without consuming the value in the `Iterator`.

> Due to how `Iterator` work, this WILL consume the next value from the upstream `Iterator` as that value will need to be consumed to inspect it. If you split iterators out and consume them in different places strategically, this will block that value from being able to be yielded by other consumers of that `Iterator`.
> That value is stored internally and will be returned the next time `next` is called.

#### `peekable(): PeekableRustIterator<T>`

on both `PeekableRustIterator` and `RustIterator`, the `peekable` method returns a `PeekableRustIterator`. Naturally returning itself, and a new instance respectively.

#### `peeked: IteratorResult<T>`

If the `Iterator` is currently in the state of having been `peeked` (`peek` has been called since the last time `next` was called), this will return that `IteratorResult`, otherwise `undefined`. This is primarily internal for handling the `peeked` value.

#### Extends `RustIterator<T>`

All of `RustIterator` methods and properties are available on `PeekableRustIterator`

### Consuming Methods

There are many different styles of methods on `RustIterator` beyond the basic interfaces presented above. I've loosely grouped these into `Consuming`, `Iterating`, and `Special` categories.

- Consuming: Immediately consumes all or a portion of the `Iterator` returning a value made from them (ex. `collect`/`reduce`)
- Iterating: Returns a new `RustIterator` that will transform the values when consumed, but does not consume the original `Iterator` (ex. `map`/`filter`)
- Special: Anything else, mainly methods that will return a new `RustIterator` while also consuming the previous `Iterator` (ex `reverse`/`sort`)

These are semantically grouped, as the mental model for how you might use them in more complex applications is distinct.

All of the methods in this group consume the `Iterator`, partially or in full, performing all upstream work to yield those values. If an `Iterator` infinitely yields values, these can potentially lock the thread entirely.

#### `collect(): T[]`

Probably the most important `Consuming` method, `collect` consumes the `Iterator` and places all of the values into an `Array`. Very useful for passing the values out to things that need `Array` or storing an intermediary collection of the values, to allow multiple iterations.

#### `into(this: RustIterator<[K, V]>,container: typeof Map): Map<K, V>`

#### `into(this: RustIterator<T>, container: typeof Set): Set<T>`

For convenience when wanting to collect the Iterator into a different collection type, you can use `into` to collect the values into a `Map` or `Set`. Just pass the `Map` or `Set` constructor as the first argument.

> Trying to pass `Map` to `into` when the Iterator type is not a `[Key, Value]` tuple will result in a type error.

#### `forEach(f: (val: T) => void): void`

> See `Array.forEach`

Consumes the `Iterator`, calling `f` with each value.

#### `fold<A = T>(fn: (acc: A, item: T) => A, initial?: A): A`

> Similar to `Array.reduce`.

Consumes the `Iterator`, calling `fn` with each value and the `initial` as an accumulator. The returned value from each `fn` call, is passed as the `acc`.

> If no `initial` is passed, the very first item yielded by the `Iterator` is used as the accumulator, with the first call of `fn` being passed both the first and second yielded values.

This is the generalized form of `reduce` that allows the `acc` type to be different from `T`.

#### `reduce(fn: (acc: T, item: T) => T, initial?: T): T`

> Similar to `Array.reduce` but requires `acc` be the same type as `T`

> Internally uses `fold`

Consumes the `Iterator`, calling `fn` with each value and the provided `initial` as an accumulator. If no `initial` is provided, the first value will be used as the accumulator.

The value returned from each calling of `fn` is passed as the first argument (`acc`) to the following call of `fn`, with the final iterations return value being returned.

#### `sum(): T where T = number | string | bigint`

> Internally uses `reduce`

Consumes the `Iterator`, adding the values together (with the `+` operator), returning the final value (a summed `number` or `bigint` or a concatenated `string`)

This will only have predictable results on `string`, `number` and `bigint` type `Iterator`. Other primitives and objects can have unpredictable and not type safe results.

#### `max(): T | undefined where T = number | bigint | string`

> Internally uses `reduce`

Returns the maximum value (with the `>` operator) yielded by the `Iterator`.

This will only have predictable results on `string`, `number` and `bigint` type `Iterator`. Other primitives and objects can have unpredictable and not type safe results.

> `string` values will be sorted by the first `codepoint` that differs between two `string` values, with later `codepoint` being returned. Characters that are made of multiple `codepoint` are treated as two separate `codepoint`. This mainly applies to non-English texts and Emojis.

#### `min(): T | undefined where T = number | bigint | string`

> Internally uses `reduce`

Returning the minimum value (with the `<` operator) yielded by the `Iterator`.

This will only have predictable results on `string`, `number` and `bigint` type `Iterator`. Other primitives and objects can have unpredictable and not type safe results.

> `string` values will be sorted by the first `codepoint` that differs between two `string` values, with earlier `codepoint` being returned. Characters that are made of multiple `codepoint` are treated as two separate `codepoint`. This mainly applies to non-English texts and Emojis.

#### `find(checker: (item: T) => unknown): T | null`

Calls the `checker` with each yielded value, returning the first value that results in a `truthy` value. Returns `null` if no such value is found.

> The `Iterator` is only consumed up until the first match. Any remaining values could still be yielded. Calling `find` multiple times could be used like `filter` in cases where the filtering condition may change as the `Iterator` is iterated.

#### `any(checker: (item: T) => unknown): boolean`

> Internally uses `find`

> See to `Array.some`

Returns `true` if any yielded value returns `true` when passed to the `checker`, otherwise `false`.

> Will return `false` if the `Iterator` yields no values

#### `all(checker: (item: T) => unknown): boolean`

> Internally uses `any`

> See `Array.every`

Returns `true` is all the yielded values return `true` when passed to the `checker`, otherwise `false`.

> Will return `true` if the `Iterator` yields no values

#### `position(checker: (item: T) => boolean): number | null`

> Similar `Array.findIndex`, except that it will not return `-1` on no match

Returns the 0-index of the first yielded value that returns `true` when passed to the `checker`.

Returns `null` when no yielded values match

#### `findIndex(checker: (item: T) => boolean): number | null`

> Alias for `position`

#### `count(): number`

Returns the count of items returned by the `Iterator`.

#### `last(): T | undefined`

Returns the final value yielded by the `Iterator`. If the `Iterator` is already `done` or never yields a value before becoming `done`, returns `undefined`.

#### `advanceBy(n: number): void`

Advances the `Iterator` `n` steps consuming those values.

#### `nth(n: number): T | undefined`

Returns the `nth` value yielded by the `Iterator`. If the `Iterator` becomes `done` before `n` values, returns `undefined`

### Iterating Methods

All of the following methods return a new `RustIterator` without consuming any values of the previous. This new `Iterator` will yield transformed, filtered, or other modified values of the previous `Iterator`.

#### `map<S>(f: (val: T) => S): RustIterator<S>`

> See `Array.map`

Will yield the result of passing each value to `f`.

#### `filter(f: (val: T) => boolean): RustIterator<T>`

> See `Array.filter`

Will yield only values that, when passed to `f`, return a `truthy` value.

#### `take(n: number): RustIterator<T>`

Will yield only the first `n` values

#### `takeWhile(f: (val: T) => boolean): RustIterator<T>`

Will continue to yield values until a value, when passed to `f` returns a `falsy` value.

> Will not yield the first value that returns `falsy`, but it will consume that value from the upstream `Iterator`.

#### `stepBy(n: number): RustIterator<T>`

Will yield only ever `nth` value from the upstream `Iterator`.

#### `enumerate(): RustIterator<[number, T]>`

Will yield tuples of the 0-index and the value.

This is useful for having access to the index like is available in the `Array` methods

#### `arrayChunks<N extends size = 1>(size: N)`

Will yield tuples of `size` length of values from the `Iterator`.

> If the end of the `Iterator` is reached and the internal chunk is not yet `size` length, the chunk is yielded as is. The missing values will be `undefined`.

#### `inspect(fn: (val: T) => void): RustIterator<T>`

Yields every value as is, but first passes the value to `fn`.

This allows accessing the value, primarily for debugging purposes, expressively in the method chain.

The most simple use is with `console.log`

```ts
iter.inspect(console.log).filter(Boolean).inspect(console.log).collect();
```

#### `scan<A = T, R = T>(fn: (state: [A], val: T) => R, initial: A): RustIterator<R>`

Yields the result of passing the value to `fn`.

`fn` is also passed a tuple of `initial` as the starting `state`, and continues to pass that same `state` as an argument to each calling of `fn`. When you mutate `state`, this allows you to iterate while maintaining some kind of internal "memory" to the iteration, so it can have some sense of the past.

#### `flat<D extends depth = 1>(depth?: D)`

> See `Array.flat`

Yields the individual values yielded by flattening the value (`where T = Iterable`) `depth` number of times.

This can allow multiple `Iterable` to be combined, to iteratively iterate over each successive `Iterable`.

> For this purpose, only `Iterable` objects will be flattened. `string`, while `Iterable`, will not be flattened into individual characters or `codepoint`.

#### `flatMap<S>(mapper: (val: T) => S)`

> See `Array.flatMap`

Yields the individual items yielded by flattening the result of calling `mapper` with the value. This will only flatten a single level.

This is similar to separately calling `.map.flat` with a `depth` of `1`.

> For this purpose, only `Iterable` objects will be flattened. `string`, while `Iterable`, will not be flattened into individual characters or `codepoint`

#### `window<S extends size = 1>(n: S)`

Yields tuples of `n` size containing a rolling window of values. Each subsequent yielded value will be the same as the previous, except with the head value removed, and a new value added at the tail.

> No window will be yielded until `n` values are consumed, even if the `Iterator` becomes `done` before then. Similarly, once the `Iterator` is done, no more values will be yielded. This means each window yielded will be `n` size, each time, every time.

### Special Methods

These methods don't cleanly fit into the above groups of methods. At this time, this mainly means they return a new `RustIterator` while consuming the previous, or otherwise having a behavior that is not simple to consider them as simply `Iterating`.

#### `chain(other: Iterable<T>): RustIterator<T>`

Individually yields all the values of `other` AFTER consuming all of the upstream `Iterator`.

#### `zip<S = T>(other: Iterable\<S\>): RustIterator<[T, S]>

Successively yields a tuple of the next values of both the upstream `Iterator` and `other`.

This is useful for merging values together as pairs automatically.

#### `cycle(): RustIterator<T>`

Repeatedly yields each individual value of the upstream `Iterator` forever, resulting in an `Iterator` that can never be `done`.

> As this requires storing all yielded values in memory, for large datasets, this means a lot of memory.

As the returned `Iterator` can NEVER end, `Consuming` methods could result in a blocked thread, if there have not been additional methods that limit the length of the `Iterator` (like `take`, `takeWhile`, `find`) that will eventually fuse the `Iterator`.

#### `sort(compare?: (a: T, b: T) => number): RustIterator<T>`

> See `Array.sort`

Yields each value of the upstream `Iterator`, after sorting the values through `compare`.

> By default this uses a `lexigraphicCompare` sort when no `compare` is passed. This emulates the native behavior of `Array.sort`, although mixed arrays of `number | string` can have strange results, as this will not turn all `number` to `string` when sorting.
> It is recommended to provide your own `compare` any time you have values that are not strictly `number | bigint`.

To accomplish this, the upstream `Iterator` is completely consumed and stored in memory, immediately upon calling this method, even if the returned `RustIterator` has not yielded any values.

To reduce the total work performed, and iteratively sort the values, a Bubble Sort algorithm is used.

When the resulting `Iterator` yields a value, the first value bubbles through being compared to each remaining value, being swapped as needed. When this process is done, the value is yielded.

As values are yielded, the internal storage of values is reduced in memory.

While Bubble Sort can increase total comparisons when needing to sort the entire list, it works nicely for this use case, as it doesn't prematurely sort any sub arrays while producing the next value. This is ideal for the purpose of an `Iterator` where you do as little work as possible until it is finally needed, and where not all values will actually need to be sorted, as in the following example.

```ts
const lowestThreePrices = prices.sort().take(3).collect();
```

While this will `collect` all of the `prices`, it will only sort out the lowest three values, discarding the remaining unsorted values.

> Due to the naive nature of the sorting implementation, the order of like values (those that when compared with `compare` return `0`) is not preserved from the original order. In fact, they will almost always be reversed. Maybe that's something to fix....in the future...

#### `reverse(): RustIterator<T>`

> See `Array.reverse`

Individually yields all the values of the upstream `Iterator` in reverse order.

To accomplish this, the upstream `Iterator` is completely consumed and stored in memory, immediately upon calling this method, even if the returned `RustIterator` has no yet yielded any values.

> The values in memory are not stored in reverse order, instead the values are yielded from the tail to the head.

## `VecDequeue`/`CircularBuffer`

Outside of the JavaScript world, `Array` are commonly of a fixed size (known at compile time to arrange for a fixed memory space). Naturally, this means that `Array` cannot change in size, like having items added or removed, which is how JavaScript `Array` work.

In these languages, commonly `Vector` (or `Vec`) is used to indicate a sequential list of unknown size (like JavaScript `Array`).

So that's why it's a `Vec`, but what is the meaning of the `Dequeue`?

### The Problem with `Array`

Both Rust `Vec` and JavaScript `Array` work in a specific way. They have one item at the start, followed by all the other items. Adding to the tail (`push`) and removing from the tail (`pop`) is simple. You just (provided there is enough memory) stick the item in the next spot, or take it out. Very simple. This is a structure commonly called a `Stack`. Last thing in is the first thing out. Very efficient.

> When implementing some pathfinding algorithms, you may handle the next step to check with a `Stack`. A simple `Depth First Search` (`DFS`) will almost always use a `Stack`

However, adding to the head (`unshift`) and removing from the head (`shift`) are much more complicated. To add a new item to the head, you need to move every other item in the list over one. So the item at index `0` is moved to index `1` and the item at index `1` is moved to index `2` and so on. Similar for removing (just moving everything to a lower index).

It's common in many algorithms, to use an `Array` as a `Queue`, where new items are added to the tail, and items are removed from the head. When used like this, `Array` perform a lot of extra work to move every item forward in line. This can be responsible for significant slowdowns when the `Queue` gets to be thousands or tens of thousands of items long.

> In many pathfinding algorithms, a `Queue` is used to schedule the search. A simple `Breadth First Search` (`BFS`) would use a `Queue`. Commonly, `Djikstra` and `A*` would use a `Queue` though they can technically be made to do either, for different reasons.

### The Solution

So, if we can add many items to the tail of a `Queue`, but each time we remove an item from the head (or DE-QUEUE it!) there is a lot of extra work moving items around, how could we make the removing of items be as efficient as if we were using a `Stack`?

The answer is in how `Array` use the memory they are given.

Typically, at the System level, lists that can be of a dynamic length. They will start with some initial size (commonly `0`) and as items are added, more memory is allocated to them, and when these allocations happen, the `Array` is moved around in memory to where it can have a single contiguous block of memory.

When items are removed, the allocated space is _not_ reduced. Instead the `Array` still occupies that space, even with no values. In JavaScript, during garbage collection, the `Array` may be moved, and the memory resized.

The basic thing to understand is that the space in memory is fixed (when not growing).

So, if the memory is fixed, and we `pop` an item off the tail, the memory is not released from the `Array`, but that space now holds no value. So, what if we could, when we `shift` a value off the head, do the same thing? Just push the start of the actual item list of the `Array` at a space in memory that is not actually the beginning of the memory space?

Well, that's how a `VecDequeue` works!!! When an item is removed from the front, we just internally track the head of the `Vec` as being at a later index. This way, items do not actually need to be moved.

### The Circular Buffer

Now, just doing that, and marching the memory along would be impractical. If we just keep pushing memory to the tail and adjusting the head back, we could end up with a memory space that is many gigabytes in size, but containing little real data! That's a horrible memory leak!

`VecDequeue` in Rust, and this `VecDequeue` in this package both handle this issue by having the memory instead be a `Circular Buffer` (which is why `VecDequeue` is exported under the alias `CircularBuffer` as well). In a `Circular Buffer` all of the list items are stored in order (as opposed to a `Linked List` that would store them scattered in memory), but the memory space is treated as being _circular_ - that is, the next item after the one stored at the end of memory is at the beginning of the memory.

As items are added and removed, the offsets for the head and tail are moved around, modifying data, but leaving everything in place. When the tail wraps all the way around to the head, we increase the total memory, and do a quick shifting of the wrapped portion of the tail to be contiguous with the head portion in the new memory space.

This means we do still sometimes move items around in memory, but only as the buffer grows. To help reduce this, the size of the buffer is doubled whenever new memory is needed, not expanded one by one. This is a common handling of list memory.

### Maybe we need a Demonstration...

In a typical `Array`, these operations would look like this:

> `empty` is used here to refer to a spot in the list _in memory_ that does not have a value. It may or may not be viewable when logging an `Array` as normally that only shows `empty` known items, not in memory space.

> Multiple lines of comments are used to indicate the internal steps the list may use to ahndle the code action

```ts
const array = new Array(3); // [empty, empty, empty]

array.push(1); // [1, empty, empty]

array.push(2); // [1, 2, empty]

array.push(3); // [1, 2, 3]

array.shift();
// | [empty, 2, 3]
// | [2, empty, 3]
// | [2, 3, empty]

array.push(4); // [2, 3, 4]

array.shift();
// | [empty, 3, 4]
// | [3, empty, 4]
// | [3, 4, empty]

array.unshift(5);
// | [3, empty, 4]
// | [empty, 3, 4]
// | [5, 3, 4]
```

Naturally, this gets worse and worse! While `push` and `pop` are `O(1)`, `shift` and `unshift` are both `O(n)`!!

Okay, so how does a `Circular Buffer` work?

```ts
const array = new CicularBuffer(3); // [empty, empty, empty]

array.push(1); // [1, empty, empty]

array.push(2); // [1, 2, empty]

array.push(3); // [1, 2, 3]

array.shift(); // [empty, 2, 3]

array.push(4); // [4, 2, 3]

array.shift(); // [4, empty, 3]

array.unshift(5); // [4, 5, 3]
```

Back to just `O(1)` updates!!

How does this shake out in practice?

In the benchmarks (in this repo run `pnpm exec vitest bench`), we see that the performance difference in different situations is as follows:

- As a **Queue** (`push` to tail, `shift` from head): `VecDequeue` performs **4.7x** faster than `Array`
- As a **Stack** (`push` to tail, `pop` from tail): `Array` performs **1.1x** faster than `VecDequeue`
- With **only head** (`unshift` to head, `shift` from head): `VecDequeue` performs **_17x_** faster than `Array`

These will of course depend, in reality, on how many operations, the distribution of those operations, and the size of the list. There were some situations where `VecDequeue` even out performed `Array` as a `Stack`.

So, `Stack` use cases may still benefit from just being a native `Array`, other cases can massively benefit from using a `VecDequeue`

### Usage

Using a `VecDequeue` is very similar to using an `Array`, we just don't get the nice literal syntax.

```ts
import { VecDequeue } from '@ekwoka/rust-ts';

const array = new VecDequeue();

for (let i = 0; i < 100; i++) array.push(i);
```

### Instance Methods

The goal for this API, though not quite there now, is to implement the whole `Array` interface, as well as a few of the useful methods of the `VecDequeue` struct from Rust. When the two have differently named methods that do the same thing, the primary name is the `Array` method, though many will be aliased with a camelcase version of the Rust name.

#### `new VecDequeue<T>(initializer: Array<T> | number = 0)`

#### `new CircularBuffer<T>(initializer: Array<T> | number = 0)`

The class is exported under both `VecDequeue` and `CircularBuffer` for convenience. It's the exact same thing.

When the `initializer` is an `Array`, the `Vec` buffer is initialized to the size of that array, the values are copied into the `Vec` buffer.

When the `initializer` is a `number` (or nothing, defaulting to `0`), The `Vec` buffer is initialized to a size of the max of `1` or the number.

#### `at(i: number): T`

Returns the value at `i` index.

> This is not the index within the internal buffer, but the 0-index from the head as it wraps around the circular buffer

#### `get(i: number): T`

> Alias of `at`

#### `set(i: number, v: T): void`

Sets a value to the `i` index.

#### `push(v: T): void`

> See `Array.push`

Pushes a value into the `Vec` at the tail.

This operation, performs a size check (by calling `grow`) before adding the value, in the event the buffer is full.

#### `pop(): T | undefined`

> See `Array.pop`

Returns the value at the tail of the `Vec` removing it from the `Vec`, or `undefined` if none exists.

#### `unshift(v: T): void

> See `Array.unshift`

Inserts a value to the `Vec` at the head.

This operation, performs a size check (by calling `grow`) before adding the value, in the event the buffer is full.

#### `shift(): T | undefined`

> See `Array.shift`

Returns the value at the head of the `Vec` removing it from the `Vec`, or `undefined` if none exists.

#### `first(): T | undefined`

Returns the value at the head of the `Vec`, or `undefined` if none exists.

#### `last(): T | undefined`

Returns the value at the tail of the `Vec`, or `undefined` if none exists.

#### `grow(): void`

> This is an internal method.

Checks if the buffer is full. If so, increases the buffer size by 100%, and moves any wrapped tail elements into the extended memory space.

#### `[@@iterator](): Iterator<T>`

Returns an `Iterator` over the items in the `Vec`, appropriately wrapping around the circular buffer.

Despite how the circular buffer, works, this has similar semantics to iterating over an array, in regards to if items are added and removed in the process. If you remove an item early in the list, the `Iterator` will appear to skip an item in its iteration.

#### `toIter(): RustIterator<T>`

Returns a `RustIterator` with the `Vec` as the upstream `Iterator`.

### Static Methods

#### `from<T>(arr: Array<T>): VecDequeue<T>`

> See `Array.from`

Creates a `VecDequeue` from an `Array`

#### `from<T>(opt: { length: number }, mapper?: (v: number, i: number) => T): VecDequeue<T>

> See `Array.from`

Creates a `VecDequeue` of `opt.length` size by passing the 0-index into `mapper` for each item in the size.

## `Prelude`

There are many places it might be useful to extend the standard library types with simple methods to convert them to these types. For convenience, you can import the prelude, which will extend the native structs with new methods

```ts
import `@ekwoka/rust-ts/prelude`
```

Currently, this only adds `iter(): RustIterator<T>` to the following classes:

- `Array`
- `String` (over individual characters)
- `Set`
- `Map` (over key value pairs)
- `Generator`
- `Iterator`

This makes it easy to create `RustIterator` instances.

```ts
const values = [1, 2, 3, 2, 1];
const unique = values.iter().into(Set).iter().collect();

assert(unique.length === 3);
```

> The above example code is stupid to prove a point
