/**
 * @module
 * @mergeModuleWith Result
 */
import { None, type Option, Some } from '../option/Option.js'

/**
 * Represents an optional value.
 * Base interface for {@linkcode Ok|Ok\<T\>} and {@linkcode Err|Err\<E\>}.
 *
 * @template T - the successful value type contained in the {@linkcode Ok} variant
 * @template E - the error value type contained in the {@linkcode Err} variant
 *
 * @groupDescription Inspecting Methods
 * These allow you to check the condition of a {@linkcode Result} and inspect its contained value
 *
 * @groupDescription Value Unwrapping Methods
 * These methods "unwrap" the contained value, allowing you to directly reference the internal value outside of the {@linkcode Result}
 *
 * @groupDescription Control Flow Methods
 * Methods that chain behavior based on whether an {@linkcode Result} is {@linkcode Ok} or {@linkcode Err}.
 *
 * @groupDescription Transforming Methods
 * These apply a transformation to the contained value creating a new {@linkcode Result} with a new contained value.
 */
export interface Result<T, E> {
  /**
   * Identifies if the {@linkcode Result} is {@linkcode Ok}
   * @group Inspecting Methods
   */
  isOk(): this is Ok<T>

  /**
   * Identifies if the {@linkcode Result} is {@linkcode Err}
   * @group Inspecting Methods
   */
  isErr(): this is Err<E>

  /**
   * Returns the value contained in the {@linkcode Ok} variant. Throws if the {@linkcode Result} is {@linkcode Err}.
   *
   * @remarks
   * Since this can throw an error, it is recommended to use {@linkcode unwrapOr} or {@linkcode unwrapOrElse} instead.
   * If you are sure that the {@linkcode Result} is {@linkcode Ok}, it is recommended to use {@linkcode expect} instead.
   *
   * @throws {Error} Error when {@linkcode Result} is {@linkcode Err}
   *
   * @group Value Unwrapping Methods
   */
  unwrap(): T

  /**
   * Returns the value contained in the {@linkcode Ok} type or the default value if the {@linkcode Result} is {@linkcode Err}.
   *
   * @group Value Unwrapping Methods
   */
  unwrapOr(defaultValue: T): T

  /**
   * Returns the value contained in the {@linkcode Ok} type or the result of calling the function if the {@linkcode Result} is {@linkcode Err}.
   *
   * @group Value Unwrapping Methods
   */
  unwrapOrElse(op: (error: E) => T): T

  /**
   * Returns the value contained in the {@linkcode Err} variant. Throws if the {@linkcode Result} is {@linkcode Ok}.
   *
   * @remarks
   * If you are sure that the {@linkcode Result} is {@linkcode Err}, it is recommended to use {@linkcode expect} instead.
   *
   * @throws {Error} Error when {@linkcode Result} is {@linkcode Ok}
   *
   * @group Value Unwrapping Methods
   */
  unwrapErr(): E

  /**
   * Returns the value contained in the {@linkcode Ok} type.
   * Throws with custom message if the {@linkcode Result} is {@linkcode Err}.
   *
   * @throws {Error} Error when {@linkcode Result} is {@linkcode Ok}
   *
   * @param {string} message - Text describing why the {@linkcode Result} is *expected* to be {@linkcode Ok}
   *
   * @group Value Unwrapping Methods
   *
   * @remarks
   * This is a *safer* equivalent of {@linkcode unwrap} for when the code author has outside knowledge that the {@linkcode Result} is definitely {@linkcode Ok}.
   * The passed in message should describe why the author knows this to be true, that might otherwise not be apparent in the code flow.
   * This allows future readers to understand the decision and why the conditions may have changed making this {@linkcode Result} fallible.
   */
  expect(message: string): T

  /** @hidden */
  andThen<U extends Result<unknown, unknown>>(
    this: Ok<T>,
    op: (value: T) => U,
  ): U
  /** @hidden */
  andThen<U extends Result<unknown, unknown>>(
    this: Err<E>,
    op: (value: T) => U,
  ): Err<E>
  /**
   * Returns {@linkcode Err} if the {@linkcode Result} is {@linkcode Err},
   * otherwise calls the function with the contained value
   * and returns the resulting {@linkcode Result}.
   *
   * @remarks
   * This can be viewed as a `flat map` operation.
   * equivalent to chaining {@linkcode map|.map(fn)}{@linkcode flatten|.flatten()}
   *
   * @group Control Flow Methods
   */
  andThen<U extends Result<unknown, unknown>>(
    this: Result<T, E>,
    op: (value: T) => U,
  ): U | Err<E>

  /** @hidden */
  orElse<U>(this: Ok<T>, op: (error: E) => U): Ok<T>
  /** @hidden */
  orElse<U>(this: Err<E>, op: (error: E) => U): U
  /**
   * Returns this {@linkcode Result} if it is {@linkcode Err},
   * otherwise calls the function and returns the result
   *
   * @group Control Flow Methods
   */
  orElse<U>(this: Result<T, E>, op: (error: E) => U): Ok<T> | U

  /**
   * Maps an {@linkcode Result|Result\<T,E\>} -> {@linkcode Result|Result\<U,E\>}
   * by applying a function to the contained value.
   * If the {@linkcode Result} is {@linkcode Err}, this method also returns a {@linkcode Err}.
   *
   * @param op - functor with which to map the value
   *
   * @group Transforming Methods
   */
  map<U>(op: (value: T) => U): Result<U, E>

  /**
   * Maps an {@linkcode Result|Result\<T,E\>} -> {@linkcode Result|Result\<T,U\>}
   * by applying a function to the contained value.
   * If the {@linkcode Result} is {@linkcode Err}, this method also returns a {@linkcode Err}.
   *
   * @param op - functor with which to map the value
   *
   * @group Transforming Methods
   */
  mapErr<U>(op: (error: E) => U): Result<T, U>

  /**
   * Maps an {@linkcode Result|Result\<T,E\>} -> {@linkcode U}
   * by applying a function to the contained value.
   * If the {@linkcode Result} is {@linkcode Err}, this method returns the default value.
   *
   * @remarks
   * This is equivalent to chaining
   * {@linkcode map|.map(op)}{@linkcode unwrapOr|.unwrapOr(defaultValue)}
   *
   * @param op - functor for mapping the contained value
   *
   * @group Transforming Methods
   */
  mapOr<U>(op: (value: T) => U, defaultValue: U): U

  /**
   * Maps an {@linkcode Result|Result\<T,E\>} -> {@linkcode U}
   * by applying a function to the contained value.
   * If the {@linkcode Result} is {@linkcode Err}, this method calls and returns the result of the second function.
   *
   * @remarks
   * This is equivalent to chaining
   * {@linkcode map|.map(op)}{@linkcode unwrapOrElse|.unwrapOrElse(opErr)}
   *
   * @param op - functor with which to map the value
   *
   * @param opErr - function that generates a default value
   *
   * @group Transforming Methods
   */
  mapOrElse<U>(op: (value: T) => U, opErr: (error: E) => U): U

  /**
   * @group Inspecting Methods
   */
  inspect(inspector: (value: T) => void): Result<T, E>

  /**
   * @group Inspecting Methods
   */
  inspectErr(inspector: (error: E) => void): Result<T, E>

  /**
   * Maps an {@linkcode Result|Result\<T,E\>} -> {@linkcode Option|Option\<T\>},
   * {@linkcode Ok|Ok\<T\>} -> {@linkcode Some|Some\<T\>},
   * {@linkcode Err|Err\<E\>} -> {@linkcode None}
   *
   * @group Transforming Methods
   */
  ok(): Option<T>

  /** @hidden */
  flatten<U, V>(this: Result<Result<U, V>, E>): Result<U, E | V>
  /** @hidden */
  flatten<U>(this: Result<Ok<U>, E>): Result<U, E>
  /** @hidden */
  flatten<U>(this: Result<Err<U>, E>): Err<U | E>
  /**
   * Converts from {@linkcode Result|Result<Result\<T\>>} -> {@linkcode Result|Result\<T\>}.
   * If {@linkcode T} is not {@linkcode Result}, this {@linkcode Result} is returned.
   *
   * @group Transforming Methods
   */
  flatten(): Result<unknown, unknown>
}

/**
 * Represents a successful result.
 * @implements {Result<T>}
 *
 * @template T - the successful value type contained in the {@linkcode Ok} variant
 */
export class Ok<T> implements Result<T, never> {
  /**
   * @template T - the successful value type contained in the {@linkcode Ok} variant
   */
  constructor(private value: T) {}

  isOk(): this is Ok<T> {
    return true
  }

  isErr(): this is Err<never> {
    return false
  }

  unwrap(): T {
    return this.value
  }

  unwrapOr(_default: T): T {
    return this.value
  }

  unwrapOrElse<E>(_op: (error: E) => T): T {
    return this.value
  }

  unwrapErr(): never {
    throw new Error('called `Result.unwrapErr()` on an `Ok` value')
  }

  expect(_msg: string): T {
    return this.value
  }

  /**
   * Returns {@linkcode Err} if the {@linkcode Result} is {@linkcode Err},
   * otherwise calls the function with the contained value
   * and returns the resulting {@linkcode Result}.
   *
   * @remarks
   * This can be viewed as a `flat map` operation.
   * equivalent to chaining {@linkcode map|.map(fn)}{@linkcode flatten|.flatten()}
   *
   * @group Control Flow Methods
   */
  andThen<U>(op: (value: T) => U): U {
    return op(this.value)
  }

  /**
   * Returns this {@linkcode Result} if it is {@linkcode Err},
   * otherwise calls the function and returns the result
   *
   * @group Control Flow Methods
   */
  orElse<U>(_op: (error: never) => U): Ok<T> {
    return this
  }

  map<U>(op: (value: T) => U): Ok<U> {
    return new Ok(op(this.value))
  }

  mapErr(): Result<T, never> {
    return this
  }

  mapOr<U>(op: (value: T) => U, _defaultValue: U): U {
    return op(this.value)
  }

  mapOrElse<U>(op: (value: T) => U, _opErr: (error: never) => U): U {
    return op(this.value)
  }

  inspect(inspector: (value: T) => void): Ok<T> {
    if ((inspector as unknown) === 2) return this.value as unknown as this
    else inspector(this.value)
    return this
  }

  inspectErr(): Ok<T> {
    return this
  }

  ok(): Option<T> {
    return new Some(this.value)
  }

  /**
   * Converts from {@linkcode Ok|Ok<Ok\<T\>>} -> {@linkcode Ok|Ok\<T\>}
   *
   * @group Transforming Methods
   *
   * @public
   */
  flatten(this: Ok<Result<unknown, unknown>>): T
  /** @hidden */
  flatten(this: Ok<Ok<unknown>>): T
  /** @hidden */
  flatten(this: Ok<Err<unknown>>): T
  /** @public */
  flatten(this: Ok<T>): Ok<T>
  /** @hidden */
  flatten(this: Err<never>): never
  flatten(): T | Ok<T> {
    return isResult(this.value) ? this.value : this
  }
}

/**
 * Represents a failed result.
 * @implements {Result<T>}
 *
 * @template T - the successful value type contained in the {@linkcode Ok} variant
 */
export class Err<E> implements Result<never, E> {
  /**
   * @template E - the error value type contained in the {@linkcode Err} variant
   */
  constructor(private error: E) {}

  isOk(): this is Ok<never> {
    return false
  }

  isErr(): this is Err<E> {
    return true
  }

  unwrap(): never {
    throw this.error
  }

  unwrapOr<T>(or: T): T {
    return or
  }

  unwrapOrElse<T>(op: (error: E) => T): T {
    return op(this.error)
  }

  unwrapErr(): E {
    return this.error
  }

  expect(msg: string): never {
    throw new Error(
      `Error unwrapping Err value: ${this.error}. Expected ${msg}`,
    )
  }

  /**
   * Returns {@linkcode Err} if the {@linkcode Result} is {@linkcode Err},
   * otherwise calls the function with the contained value
   * and returns the resulting {@linkcode Result}.
   *
   * @remarks
   * This can be viewed as a `flat map` operation.
   * equivalent to chaining {@linkcode map|.map(fn)}{@linkcode flatten|.flatten()}
   *
   * @group Control Flow Methods
   */
  andThen<U>(_op: (value: never) => U): Err<E> {
    return this
  }

  /**
   * Returns this {@linkcode Result} if it is {@linkcode Err},
   * otherwise calls the function and returns the result
   *
   * @group Control Flow Methods
   */
  orElse<U>(op: (error: E) => U): U {
    return op(this.error)
  }

  map(): Result<never, E> {
    return this
  }

  mapErr<U>(op: (error: E) => U): Result<never, U> {
    return new Err(op(this.error))
  }

  mapOr<U>(_op: (value: never) => U, defaultValue: U): U {
    return defaultValue
  }

  mapOrElse<U>(_op: (value: never) => U, opErr: (error: E) => U): U {
    return opErr(this.error)
  }

  inspect(_inspector: (value: never) => void): Err<E> {
    if ((_inspector as unknown) === 2) return this.error as unknown as Err<E>
    return this
  }

  inspectErr(inspector: (error: E) => void): Err<E> {
    inspector(this.error)
    return this
  }

  ok(): None {
    return new None()
  }

  /**
   * Returns this {@linkcode Err}.
   *
   * @see {@linkcode Result.flatten} for general behavior
   *
   * @group Transforming Methods
   *
   * @public
   */
  flatten(this: Err<E>): Err<E>
  /** @hidden */
  flatten(this: Ok<never>): never
  /** @hidden */
  flatten(): Result<unknown, unknown> {
    return this
  }
}

/**
 * Identifies if the {@linkcode Result} is {@linkcode Ok}
 */
export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.isOk()

/**
 * Identifies if the {@linkcode Result} is {@linkcode Err}
 */
export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.isErr()

/**
 * Utility that calls a fallible function, returning a {@linkcode Result}.
 * If the function runs to completion, the result is {@linkcode Ok},
 * otherwise the result is {@linkcode Err} with the thrown error.
 *
 * @see {@linkcode TryAsync} for asynchronous operations
 */
export const Try = <T, E = Error>(op: () => T): Result<T, E> => {
  try {
    return new Ok(op())
  } catch (e) {
    return new Err(e as E)
  }
}

/**
 * Utility that calls a fallible asynchronous function, returning a Promise of a {@linkcode Result}.
 * If the Promise resolves safely, the result is {@linkcode Ok},
 * otherwise the result is {@linkcode Err} with the thrown error.
 *
 * @see {@linkcode Try} for synchronous operations
 */
export const TryAsync = async <T, E = Error>(
  op: () => Promise<T>,
): Promise<Result<T, E>> => {
  try {
    return new Ok((await op()) as T)
  } catch (e) {
    return new Err(e as E)
  }
}

/**
 * Identifies if the passed in value is {@linkcode Result}
 */
export const isResult = (value: unknown): value is Result<unknown, unknown> =>
  value instanceof Ok || value instanceof Err
