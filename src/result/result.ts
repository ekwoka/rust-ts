const ok = Symbol();
const err = Symbol();

export type OK<T> = { [ok]: true; value: T };
export type ERR<E> = { [err]: true; error: E };

export type Result<T, E> = OK<T> | ERR<E>;

export const Ok = <T>(value: T): OK<T> => ({ [ok]: true, value });

export const Err = <E>(error: E): ERR<E> => ({ [err]: true, error });

export const isOk = <T, E>(result: Result<T, E>): result is OK<T> =>
  ok in result;

export const isErr = <T, E>(result: Result<T, E>): result is ERR<E> =>
  err in result;
