import { Err, Ok, type Result } from '../result/Result.js'

const none = Symbol()
type none = typeof none

export interface Option<T = unknown, _N extends none = none> {
  /**
   * The value contained in the Option
   * @type {T}
   */
  val: T

  /**
   * Returns true if the option is a `Some` type.
   * @returns {this is Some<T>}
   */
  isSome(): this is Some<T>

  /**
   * Returns true if the option is a `None` type.
   * @returns {this is None}
   */
  isNone(): this is None

  /**
   * Returns the value contained in the `Some` type. Throws if the `Option` is a `None`.
   * Since this can throw an error, it is recommended to use `unwrapOr` or `unwrapOrElse` instead.
   * If you are sure that the `Option` is a `Some`, it is recommended to use `expect` instead.
   * @returns {T}
   * @throws {Error}
   */
  unwrap(): T

  /**
   * Returns the value contained in the `Some` type or the default value if the `Option` is a `None`.
   * @param {T} defaultValue
   * @returns {T}
   */
  unwrapOr(defaultValue: T): T

  /**
   * Returns the value contained in the `Some` type or the result of the function if the `Option` is a `None`.
   * @param {() => T} op
   * @returns {T}
   */
  unwrapOrElse(op: () => T): T

  /**
   * Returns the value contained in the `Some` type.
   * Throws with custom message if the `Option` is a `None`.
   * @param {string} message - Should describe why the Option is expected to be Some
   * @returns {T}
   * @throws {Error}
   */
  expect(message: string): T

  /**
   * Returns None if the Option is a `None`, otherwise calls the function with the contained value and returns the resulting Option.
   * This can be viewed as a `flat map` operation.
   * (equivalent to chaining `.map(fn).flatten()`)
   * @param {(value: T) => Option} op
   * @returns {Option}
   */
  andThen<U extends Option>(this: Some<T>, op: (value: T) => U): U
  andThen<U extends Option>(this: None, op: (value: T) => U): None
  andThen<U extends Option>(op: (value: T) => U): U | None

  /**
   * Returns the Option if it contains a value, otherwise calls the function and returns the result.
   * @param {() => Option} op
   * @returns {Option}
   */
  orElse<U extends Option>(this: Some<T>, op: () => U): Some<T>
  orElse<U extends Option>(this: None, op: () => U): U
  orElse<U extends Option>(op: () => U): U | Some<T>

  /**
   * Maps an `Option<T>` -> `Option<U>` by applying a function to the contained value. If the Option is a `None`, this method also returns a `None`.
   * @param {(value: T) => U} op - functor with which to map the value
   * @returns {Option<U>}
   */
  map<U>(op: (value: T) => U): Option<U>

  /**
   * Maps an `Option<T>` -> `U` by applying a function to the contained value. If the Option is a `None`, this method returns the default value.
   * This is equivalent to chaining `.map(op).unwrapOr(defaultValue)`
   * @param {(value: T) => U} op
   * @param {U} defaultValue
   * @returns {U}
   */
  mapOr<U>(op: (value: T) => U, defaultValue: U): U

  /**
   * Maps an `Option<T>` -> `U` by applying a function to the contained value. If the Option is a `None`, this method calls and returns the result of the second function.
   * This is equivalent to chaining `.map(op).unwrapOrElse(opErr)`
   * @param {(value: T) => U} op
   * @param {() => U} opErr
   * @returns {U}
   */
  mapOrElse<U>(op: (value: T) => U, opErr: () => U): U

  /**
   * Converts from `Option<Option<U>>` to `Option<U>`
   * @returns {Option<T> | Option<U>}
   */
  flatten<U extends Option<unknown>>(this: Option<U>): U
  flatten(this: Option<T>): Option<T>
  flatten(): Option<unknown>

  /**
   * Inspects the `Option` value by calling the function with the contained value if it is a `Some`.
   * @param {(value: T) => void} inspector
   * @returns {Option<T>}
   */
  inspect(inspector: (value: T) => void): Option<T>

  /**
   * Maps an `Option<T> -> Result<T, E>`.
   * `Some<T> -> Ok<T>`
   * `None -> Err<E>`
   * @param {E} error
   * @returns {Result<T, E>}
   */
  okOr<E>(error: E): Result<T, E>
}

export class Some<T> implements Option<T> {
  val: T
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

  andThen<U>(op: (value: T) => U): U {
    return op(this.val)
  }
  orElse<U>(_op: () => U): Some<T> {
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

  flatten<U extends Option<unknown>>(this: Some<U>): U
  flatten(this: Some<T>): Some<T>
  flatten(): Option<unknown> {
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

  andThen<U>(_op: (value: never) => U): None {
    return this
  }
  orElse<U>(op: () => U): U {
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
