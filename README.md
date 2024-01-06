# Clean Implementation of Various Rust Style Structs

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
- DequeueVec (partial)

There is also some progress made on an implementation for `Future` to allow Promises to be awaited as a property expression, and not only with the await keyword.

## Installation

```bash
pnpm add @ekwoka/rust-ts
```

## `Result<T,E>` and `Option<T>`

These two Enums in Rust are used to handle methods and functions that can error, by returning a `Result` variant, and those that can return nothing, by returning an `Option` variant.

Since these two do serve somewhat similar purposes, they also have fairly similar interfaces.

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




