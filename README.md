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
	.map(item => ({ statusCode: 200, body: item }))
	.unwrapOrElse(error => ({ statusCode: 500, body: error }))
```

Here, `decrypt` returns a `Result` that indicates if the data could be properly decrypted, or an error if it fails to decrypt, and then the success condition and the error condition can be handled expressively to conform them into the same shape object, without needing statements or other behaviors.

This can be chained near endlessly, allowing a focus on the happy path, and deferring error handling, similar to `.then/.catch` but with better flow.

```ts
return decrypt(data)
	.andThen(JSON.tryParse)
	.andThen(Item.tryFrom)
	.map(item => ({ statusCode: 200, body: item }))
	.unwrapOrElse(error => ({ statusCode: 500, body: error }))
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
getUser(userID)
```

Is the id not matching to a user an error? Not really. Any kind of `find` action, something not being found is quite different from there being an error in the process of searching. So you can return an `Option` to indicate, in this case, the specified user may or may not exist.

```ts
return getUser(userID).orElse(createUser)
```

Here, we can get the user, or create it if it doesn't exist already, all in an expression that allows focusing on the happy path

### Usage

To use the `Result` and `Option` enums, you can simply import their appropriate Variant for your case and instantiate it as a class (except for `None` which is already instantiated as a constant instance)

```ts
import { Ok, Err } from '@ekwoka/rust-ts'

export const tryParseJSON = (data: string) => {
  // to handle thrown exceptions from native methods
  try {
  
    // if successful will return an `Ok`
    return new Ok(JSON.parse(data))
    
  } catch (e) {
  
    // if an error was thrown, will return an `Err`
    return new Err(e) 
  }
}


// attempts to parse and logs the hello key to the console if it exists. Does nothing on an error
tryParseJSON('{"hello":"world"}').map(data => data.hello).andThen(console.log)
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
import type { Result, Option } from '@ekwoka/rust-ts'

declare const tryParse = (data: string) => Result<unknown, SyntaxError>
declare const getUser = (userId: string) => Option<User>
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
const config = readFile('./config.toml').expect('Config file must be present for application to run')
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