/**
 * @module
 * @mergeModuleWith Option
 */
import { Err, Ok, type Result } from '../result/Result.js'

const none = Symbol()
type none = typeof none

/**
 * Represents an optional value.
 * Base interface for {@linkcode Some|Some\<T\>} and {@linkcode None}.
 * @template T - the value contained in the {@linkcode Option}
 * @groupDescription Inspecting Methods
 * These allow you to check the condition of an {@linkcode Option} and inspect its contained value
 *
 * @groupDescription Value Unwrapping Methods
 * These methods "unwrap" the contained value, allowing you to directly reference the internal value outside of the {@linkcode Option}
 *
 * @groupDescription Control Flow Methods
 * Methods that chain behavior based on whether an {@linkcode Option} is {@linkcode Some} or {@linkcode None}.
 *
 * @groupDescription Transforming Methods
 * These apply a transformation to the contained value creating a new {@linkcode Option} with a new contained value.
 */
export interface Option<T = unknown, _N extends none = none> {
  /**
   * The value contained in the Option
   * @private
   */
  val: T

  /**
   * Returns true if the option is a `Some` type.
   * @group Inspecting Methods
   */
  isSome(): this is Some<T>

  /**
   * Returns true if the option is a `None` type.
   * @group Inspecting Methods
   */
  isNone(): this is None

  /**
   * Returns the value contained in the {@linkcode Some} type. Throws if the {@linkcode Option} is {@linkcode None}.
   *
   * @remarks
   * Since this can throw an error, it is recommended to use {@linkcode unwrapOr} or {@linkcode unwrapOrElse} instead.
   * If you are sure that the {@linkcode Option} is {@linkcode Some}, it is recommended to use {@linkcode expect} instead.
   *
   * @throws {Error} Error when {@linkcode Option} is {@linkcode None}
   *
   * @group Value Unwrapping Methods
   */
  unwrap(): T

  /**
   * Returns the value contained in the {@linkcode Some} type or the default value if the {@linkcode Option} is {@linkcode None}.
   *
   * @group Value Unwrapping Methods
   */
  unwrapOr(defaultValue: T): T

  /**
   * Returns the value contained in the {@linkcode Some} type or the result of calling the function if the {@linkcode Option} is {@linkcode None}.
   *
   * @group Value Unwrapping Methods
   */
  unwrapOrElse(op: () => T): T

  /**
   * Returns the value contained in the {@linkcode Some} type.
   * Throws with custom message if the {@linkcode Option} is {@linkcode None}.
   *
   * @throws {Error} Error when {@linkcode Option} is {@linkcode Some}
   *
   * @param {string} message - Text describing why the {@linkcode Option} is *expected* to be {@linkcode Some}
   *
   * @group Value Unwrapping Methods
   *
   * @remarks
   * This is a *safer* equivalent of {@linkcode unwrap} for when the code author has outside knowledge that the {@linkcode Option} is definitely {@linkcode Some}.
   * The passed in message should describe why the author knows this to be true, that might otherwise not be apparent in the code flow.
   * This allows future readers to understand the decision and why the conditions may have changed making this {@linkcode Option} fallible.
   */
  expect(message: string): T

  /** @hidden */
  andThen<U extends Option>(this: Some<T>, op: (value: T) => U): U
  /** @hidden */
  andThen<U extends Option>(this: None, op: (value: T) => U): None
  /**
   * Returns {@linkcode None} if the {@linkcode Option} is {@linkcode None},
   * otherwise calls the function with the contained value
   * and returns the resulting {@linkcode Option}.
   *
   * @remarks
   * This can be viewed as a `flat map` operation.
   * equivalent to chaining {@linkcode map|.map(fn)}{@linkcode flatten|.flatten()}
   *
   * @group Control Flow Methods
   */
  andThen<U extends Option>(op: (value: T) => U): U

  /** @hidden */
  orElse<U extends Option>(this: Some<T>, op: () => U): Some<T>
  /** @hidden */
  orElse<U extends Option>(this: None, op: () => U): U
  /**
   * Returns this {@linkcode Option} if it is {@linkcode Some},
   * otherwise calls the function and returns the result
   *
   * @group Control Flow Methods
   */
  orElse<U extends Option>(op: () => U): Option<T | U>

  /**
   * Maps an {@linkcode Option|Option\<T\>} -> {@linkcode Option|Option\<U\>}
   * by applying a function to the contained value.
   * If the {@linkcode Option} is {@linkcode None}, this method also returns a {@linkcode None}.
   *
   * @param op - functor with which to map the value
   *
   * @group Transforming Methods
   */
  map<U>(op: (value: T) => U): Option<U>

  /**
   * Maps an {@linkcode Option|Option\<T\>} -> {@linkcode U}
   * by applying a function to the contained value.
   * If the {@linkcode Option} is {@linkcode None}, this method returns the default value.
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
   * Maps an {@linkcode Option|Option\<T\>} -> {@linkcode U}
   * by applying a function to the contained value.
   * If the {@linkcode Option} is {@linkcode None}, this method calls and returns the result of the second function.
   *
   * @remarks
   * This is equivalent to chaining
   * {@linkcode map|.map(op)}{@linkcode unwrapOrElse|.unwrapOrElse(opErr)}
   *
   * @param op - functor with which to map the value
   *
   * @param opNone - function that generates a default value
   *
   * @group Transforming Methods
   */
  mapOrElse<U>(op: (value: T) => U, opNone: () => U): U

  /** @hidden */
  flatten<U extends Option<unknown>>(this: Option<U>): U
  /** @hidden */
  flatten(this: Option<T>): Option<T>
  /**
   * Converts from {@linkcode Option|Option<Option\<unknown\>>} -> {@linkcode Option|Option\<unknown\>}.
   * If {@linkcode T} is not {@linkcode Option}, this {@linkcode Option} is returned.
   *
   * @group Transforming Methods
   */
  flatten(): Option

  /**
   * Inspects the {@linkcode Option} value
   * by calling the function with the contained value if it is a {@linkcode Some}.
   *
   * @group Inspecting Methods
   */
  inspect(inspector: (value: T) => void): Option<T>

  /**
   * Maps an {@linkcode Option|Option\<T\>} -> {@linkcode Result|Result\<T, E\>},
   * {@linkcode Some|Some\<T\>} -> {@linkcode Ok|Ok\<T\>},
   * {@linkcode None} -> {@linkcode Err|Err\<E\>}
   *
   * @param {E} error - values to contain in {@linkcode Err}
   *
   * @group Transforming Methods
   */
  okOr<E>(error: E): Result<T, E>
}

/**
 * Represents a value that is present.
 * @implements {Option<T>}
 * @groupDescription Inspecting Methods
 * These allow you to check the condition of an {@linkcode Option} and inspect its contained value
 *
 * @groupDescription Value Unwrapping Methods
 * These methods "unwrap" the contained value, allowing you to directly reference the internal value outside of the {@linkcode Option}
 *
 * @groupDescription Control Flow Methods
 * Methods that chain behavior based on whether an {@linkcode Option} is {@linkcode Some} or {@linkcode None}.
 *
 * @groupDescription Transforming Methods
 * These apply a transformation to the contained value creating a new {@linkcode Option} with a new contained value.
 */
export class Some<T> implements Option<T> {
  val: T

  /**
   * Creates a new `Some` type with the given value.
   * @template T - the value contained in the {@linkcode Option}
   */
  constructor(val: T) {
    this.val = val
  }

  isSome(): this is Some<T> {
    return true
  }
  isNone(): this is None {
    return false
  }

  unwrap(): T {
    return this.val
  }
  unwrapOr(_default: T): T {
    return this.val
  }
  unwrapOrElse(_op: () => T): T {
    return this.val
  }
  expect(_msg: string): T {
    return this.val
  }

  /**
   * Calls the function with the {@linkcode Some}'s contained value and returns the resulting {@linkcode Option}.
   * @see {@linkcode Option.andThen} for generalized behavior.
   *
   * @remarks
   * This can be viewed as a `flat map` operation.
   * Equivalent to chaining {@linkcode map|.map(fn)}{@linkcode flatten|.flatten()}
   *
   * @group Control Flow Methods
   */
  andThen<U extends Option>(op: (value: T) => U): U {
    return op(this.val)
  }

  /**
   * Returns this {@linkcode Some} without calling the passed function
   *
   * @see {@linkcode Option.orElse} for generalized behavior
   *
   * @group Control Flow Methods
   */
  orElse<U extends Option>(_op: () => U): Some<T> {
    return this
  }

  map<U>(op: (value: T) => U): Some<U> {
    return new Some(op(this.val)) as Some<U>
  }

  mapOr<U>(op: (value: T) => U, _defaultValue: U): U {
    return op(this.val)
  }

  mapOrElse<U>(op: (value: T) => U, _opErr: () => U): U {
    return op(this.val)
  }

  /**
   * Converts from {@linkcode Option|Option<Option\<unknown\>>} -> {@linkcode Option|Option\<unknown\>}. If {@linkcode T} is not {@linkcode Option}, this {@linkcode Option} is returned
   *
   * @group Transforming Methods
   *
   * @public
   */
  flatten<U extends Option<unknown>>(this: Some<U>): U
  /** @public */
  flatten(this: Some<T>): Some<T>
  flatten(): Option {
    if (isOption(this.val)) return this.val
    return this
  }

  inspect(inspector: (value: T) => void): Some<T> {
    if ((inspector as unknown) === 2) return this as unknown as Some<T>
    else inspector(this.val)
    return this
  }

  okOr<E>(_error: E): Ok<T> {
    return new Ok(this.val)
  }
}

/**
 * Represents a value that is absent.
 * @implements {Option<T>}
 * @groupDescription Inspecting Methods
 * These allow you to check the condition of an {@linkcode Option} and inspect its contained value
 *
 * @groupDescription Value Unwrapping Methods
 * These methods "unwrap" the contained value, allowing you to directly reference the internal value outside of the {@linkcode Option}
 *
 * @groupDescription Control Flow Methods
 * Methods that chain behavior based on whether an {@linkcode Option} is {@linkcode Some} or {@linkcode None}.
 *
 * @groupDescription Transforming Methods
 * These apply a transformation to the contained value creating a new {@linkcode Option} with a new contained value.
 */
export class None implements Option<never, none> {
  val: never = null as never

  isSome(): this is Some<never> {
    return false
  }
  isNone(): this is None {
    return true
  }

  unwrap(): never {
    throw new Error('called `Option.unwrap()` on a `None` value')
  }
  unwrapOr<T>(or: T): T {
    return or
  }
  unwrapOrElse<T>(op: () => T): T {
    return op()
  }
  expect(msg: string): never {
    throw new Error(`Error unwrapping None. Expected ${msg}`)
  }

  /**
   * Returns {@linkcode None}.
   * @see {@linkcode Option.andThen} for generalized behavior.
   *
   * @group Control Flow Methods
   */
  andThen<U extends Option>(_op: (value: never) => U): None {
    return this
  }

  /**
   * Calls the passed function and returns the result
   *
   * @see {@linkcode Option.orElse} for generalized behavior
   *
   * @group Control Flow Methods
   */
  orElse<U extends Option>(op: () => U): U {
    return op()
  }

  map<U>(_op: (v: never) => U): Option<U> {
    return this as unknown as Option<U>
  }
  mapOr<U>(_op: (value: never) => U, defaultValue: U): U {
    return defaultValue
  }
  mapOrElse<U>(_op: (value: never) => U, opErr: () => U): U {
    return opErr()
  }

  /**
   * When called on {@linkcode None} this returns {@linkcode None}.
   *
   * @see {@linkcode Option.flatten} for generalized behavior
   *
   * @group Transforming Methods
   *
   * @public
   */
  flatten(): None {
    return this
  }

  inspect(_op: (_v: never) => void): None {
    return this
  }

  okOr<E>(error: E): Err<E> {
    return new Err(error)
  }
}

const isOption = <T extends Option<unknown>>(
  value: T | unknown,
): value is T => {
  return value instanceof Some || value instanceof None
}
