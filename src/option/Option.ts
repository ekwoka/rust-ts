import { Err, Ok, Result } from '../result/Result.js'

const none = Symbol()
type none = typeof none

export interface Option<T = unknown, _N extends none = none> {
  val: T
  isSome(): this is Some<T>
  isNone(): this is None

  unwrap(): T
  unwrapOr(defaultValue: T): T
  unwrapOrElse(op: () => T): T
  expect(message: string): T

  andThen<U>(this: Some<T>, op: (value: T) => U): U
  andThen<U>(this: None, op: (value: T) => U): None
  andThen<U>(op: (value: T) => U): U | None

  orElse<U>(this: Some<T>, op: () => U): Some<T>
  orElse<U>(this: None, op: () => U): U
  orElse<U>(op: () => U): U | Some<T>

  map<U>(op: (value: T) => U): Option<U>
  mapOr<U>(op: (value: T) => U, defaultValue: U): U
  mapOrElse<U>(op: (value: T) => U, opErr: () => U): U

  flatten<U extends Option<unknown>>(this: Option<U>): U
  flatten(this: Option<T>): Option<T>
  flatten(): Option<unknown>

  inspect(inspector: (value: T) => void): Option<T>

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
  unwrapOrElse(_op: never): T {
    return this.val
  }
  expect(_msg: string): T {
    return this.val
  }

  andThen<U>(op: (value: T) => U): U {
    return op(this.val)
  }
  orElse(): Some<T> {
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

  okOr<E>(_error: E): Result<T, E> {
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

  andThen(): None {
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

  inspect(): None {
    return this
  }

  okOr<E>(error: E): Result<never, E> {
    return new Err(error)
  }
}

const isOption = <T extends Option<unknown>>(
  value: T | unknown,
): value is T => {
  return value instanceof Some || value instanceof None
}
