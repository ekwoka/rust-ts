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
}

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  result.isOk();

export const isErr = <T, E>(result: Result<T, E>): result is Err<E> =>
  result.isErr();
