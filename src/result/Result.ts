const ok = Symbol();
const err = Symbol();

export interface Result<T, E> {
  isOk(): boolean;
  isErr(): boolean;

  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapErr(): E;

  andThen<U>(op?: (value: T) => U): U | Err<E>;
  orElse<U>(op?: (error: E) => U): U | Ok<T>;

  map<U>(op: (value: T) => U): Result<U, E>;
  mapErr<U>(op: (error: E) => U): Result<T, U>;
  mapOr<U>(op: (value: T) => U, defaultValue: U): U;
  mapOrElse<U>(op: (value: T) => U, opErr: (error: E) => U): U;
}

export class Ok<T> implements Result<T, never> {
  ok = ok;
  constructor(public value: T) {}
  isOk(): boolean {
    return true;
  }
  isErr(): boolean {
    return false;
  }
  unwrap(): T {
    return this.value;
  }
  unwrapOr(_default: T): T {
    return this.value;
  }
  unwrapErr(): never {
    throw new Error('called `Result.unwrapErr()` on an `Ok` value');
  }
  andThen<U>(op: (value: T) => U): U {
    return op(this.value);
  }
  orElse(): Ok<T> {
    return this;
  }

  map<U>(op: (value: T) => U): Ok<U> {
    return new Ok(op(this.value));
  }
  mapErr(): Ok<T> {
    return this;
  }
  mapOr<U>(op: (value: T) => U, _defaultValue: U): U {
    return op(this.value);
  }
  mapOrElse<U>(op: (value: T) => U, _opErr: (error: never) => U): U {
    return op(this.value);
  }
}

export class Err<E> implements Result<never, E> {
  err = err;
  constructor(public error: E) {}
  isOk(): boolean {
    return false;
  }
  isErr(): boolean {
    return true;
  }
  unwrap(): never {
    throw this.error;
  }
  unwrapOr<T>(or: T): T {
    return or;
  }
  unwrapErr(): E {
    return this.error;
  }
  andThen(): Err<E> {
    return this;
  }
  orElse<U>(op: (error: E) => U): U {
    return op(this.error);
  }

  map(): Err<E> {
    return this;
  }
  mapErr<U>(op: (error: E) => U): Err<U> {
    return new Err(op(this.error));
  }
  mapOr<U>(_op: (value: never) => U, defaultValue: U): U {
    return defaultValue;
  }
  mapOrElse<U>(_op: (value: never) => U, opErr: (error: E) => U): U {
    return opErr(this.error);
  }
}

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.isOk();

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.isErr();
