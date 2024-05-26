import { None as NoneType, Option, Some } from '../option/Option.js';
import { None } from '../option/index.js';

const ok = Symbol();
const err = Symbol();

export interface Result<T, E> {
  isOk(): this is Ok<T>;
  isErr(): this is Err<E>;

  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(op: (error: E) => T): T;
  unwrapErr(): E;
  expect(message: string): T;

  andThen<U>(this: Ok<T>, op: (value: T) => U): U;
  andThen<_U>(this: Err<E>): Err<E>;
  andThen<U>(this: Result<T, E>, op?: (value: T) => U): U | this;

  orElse<U>(op?: (error: E) => U): U | Ok<T>;

  map<U>(op: (value: T) => U): Result<U, E>;
  mapErr<U>(op: (error: E) => U): Result<T, U>;
  mapOr<U>(op: (value: T) => U, defaultValue: U): U;
  mapOrElse<U>(op: (value: T) => U, opErr: (error: E) => U): U;

  inspect(inspector: (value: T) => void): Result<T, E>;
  inspectErr(inspector: (error: E) => void): Result<T, E>;

  ok(): Option<T>;

  flatten<R extends Result<unknown, unknown>>(this: Ok<R>): R;
  flatten(this: Ok<T>): T extends Result<unknown, unknown> ? T : Ok<T>;
  flatten(this: Err<E>): Err<E>;
  flatten<U, F>(this: Result<Result<U, F>, E>): Result<U, E | F>;
  flatten(this: Result<T, E>): Result<T, E>;
  flatten(): Result<unknown, unknown>;
}

export class Ok<T> implements Result<T, never> {
  is = ok;
  value: T;
  constructor(value?: T) {
    this.value = value as T;
  }
  isOk(): this is Ok<T> {
    return true;
  }
  isErr(): this is Err<never> {
    return false;
  }
  unwrap(): T {
    return this.value;
  }
  unwrapOr(_default: T): T {
    return this.value;
  }
  unwrapOrElse(_op: never): T {
    return this.value;
  }
  unwrapErr(): never {
    throw new Error('called `Result.unwrapErr()` on an `Ok` value');
  }
  expect(_msg: string): T {
    return this.value;
  }

  andThen<U>(this: Ok<T>, op: (value: T) => U): U;
  andThen<_U>(this: Err<never>): never;
  andThen<U>(this: Result<T, never>, op?: (value: T) => U): U | this;
  andThen<U>(op?: (value: T) => U): U | this {
    return op!(this.value);
  }
  orElse(): Ok<T> {
    return this;
  }

  map<U>(op: (value: T) => U): Result<U, never> {
    return new Ok(op(this.value));
  }
  mapErr(): Result<T, never> {
    return this;
  }
  mapOr<U>(op: (value: T) => U, _defaultValue: U): U {
    return op(this.value);
  }
  mapOrElse<U>(op: (value: T) => U, _opErr: (error: never) => U): U {
    return op(this.value);
  }

  inspect(inspector: (value: T) => void): Ok<T> {
    if ((inspector as unknown) === 2) return this.value as unknown as this;
    else inspector(this.value);
    return this;
  }
  inspectErr(): Ok<T> {
    return this;
  }

  ok(): Option<T> {
    return new Some(this.value);
  }

  flatten<R extends Result<unknown, unknown>>(this: Ok<R>): R;
  flatten(this: Ok<T>): T extends Result<unknown, unknown> ? T : this;
  flatten(this: Err<never>): never;
  flatten<U, F>(this: Result<Result<U, F>, never>): Result<U, never | F>;
  flatten(this: Result<T, never>): this;
  flatten(): T | this | Result<unknown, unknown> {
    const val = this.value;
    return isResult(val) ? val : this;
  }
}

export class Err<E> implements Result<never, E> {
  is = err;
  error: E;
  constructor(error?: E) {
    this.error = error as E;
  }
  isOk(): this is Ok<never> {
    return false;
  }
  isErr(): this is Err<E> {
    return true;
  }
  unwrap(): never {
    throw this.error;
  }
  unwrapOr<T>(or: T): T {
    return or;
  }
  unwrapOrElse<T>(op: (error: E) => T): T {
    return op(this.error);
  }
  unwrapErr(): E {
    return this.error;
  }
  expect(msg: string): never {
    throw new Error(
      `Error unwrapping Err value: ${this.error}. Expected ${msg}`,
    );
  }

  andThen(): Err<E> {
    return this;
  }
  orElse<U>(op: (error: E) => U): U {
    return op(this.error);
  }

  map(): Result<never, E> {
    return this;
  }
  mapErr<U>(op: (error: E) => U): Result<never, U> {
    return new Err(op(this.error));
  }
  mapOr<U>(_op: (value: never) => U, defaultValue: U): U {
    return defaultValue;
  }
  mapOrElse<U>(_op: (value: never) => U, opErr: (error: E) => U): U {
    return opErr(this.error);
  }

  inspect(_inspector: (value: never) => void): Err<E> {
    if ((_inspector as unknown) === 2) return this.error as unknown as Err<E>;
    return this;
  }
  inspectErr(inspector: (error: E) => void): Err<E> {
    inspector(this.error);
    return this;
  }

  ok(): NoneType {
    return None;
  }

  flatten<U extends Result<unknown, unknown>>(this: Ok<U>): U;
  flatten(
    this: Ok<never>,
  ): never extends Result<unknown, unknown> ? never : Ok<never>;
  flatten(this: Err<E>): Err<E>;
  flatten<U, F>(this: Result<Result<U, F>, E>): Result<U, E | F>;
  flatten(this: Result<never, E>): Result<never, E>;
  flatten(): unknown {
    return this;
  }
}

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.isOk();

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.isErr();

export const Try = <T, E = Error>(op: () => T): Result<T, E> => {
  try {
    return new Ok(op());
  } catch (e) {
    return new Err(e as E);
  }
};

export const TryAsync = async <T, E = Error>(
  op: () => Promise<T>,
): Promise<Result<T, E>> => {
  try {
    return new Ok((await op()) as T);
  } catch (e) {
    return new Err(e as E);
  }
};

export const isResult = (value: unknown): value is Result<unknown, unknown> =>
  value instanceof Ok || value instanceof Err;
