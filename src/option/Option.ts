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

  andThen<U>(op: (value: T) => U): U | None
  orElse<U>(op: () => U): U | Some<T>

  map<U>(op: (value: T) => U): Option<U>
  mapOr<U>(op: (value: T) => U, defaultValue: U): U
  mapOrElse<U>(op: (value: T) => U, opErr: () => U): U

  flatten(): FlattenOptionType<T>

  inspect(inspector: (value: T) => void): Option<T>

  okOr<E>(error: E): Result<T, E>
}

export class Some<T> implements Option<T> {
  val: T
  constructor(val: T) {
    this.val = val
  }
  isSome(): true {
    return true
  }

  isNone(): false {
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
  flatten(): FlattenOptionType<T> {
    if (isOption(this.val)) return this.val as FlattenOptionType<T>
    return this as unknown as FlattenOptionType<T>
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
  isSome(): false {
    return false
  }
  isNone(): true {
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

type FlattenOptionType<T> = Option<T extends Option<infer Inner> ? Inner : T>
