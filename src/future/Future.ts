/* eslint-disable @typescript-eslint/no-unused-vars */
type ThenCatchFinallyCallback<P, R> = InOut<P, R | PromiseLike<R>> | null
type FutureExecutor<T, E = never> = (
  resolve: (res: T) => void,
  reject: (rej: E) => void,
) => void

const _passThrough = <T>(value: T): T => value
type InOut<I, O> = (input: I) => O

enum FutureState {
  OPEN = 0b1,
  PENDING = 0b10,
  RESOLVED = 0b100,
  REJECTED = 0b1000,
}

interface WithResolvers<T, E> {
  resolve: (res: T) => void
  reject: (rej: E) => void
}

export class Future<T, E> implements Promise<T>, WithResolvers<T, E> {
  [Symbol.toStringTag] = 'Future';
  [Symbol.species] = Future
  result: T | undefined = undefined
  error: E | undefined = undefined
  state: FutureState = FutureState.OPEN
  constructor(executor?: FutureExecutor<T, E> | PromiseLike<T>) {
    if (isPromiseLike(executor)) this.pipe(executor)
    else if (typeof executor === 'function')
      executor?.(this.resolve.bind(this), this.reject.bind(this))
  }
  pipe(promise: PromiseLike<T>) {
    promise.then(this.resolve.bind(this), this.reject.bind(this))
  }
  handleChain(chain: MaybeArray<WithResolvers<T, E>>) {
    if (!Array.isArray(chain)) chain = [chain]
    if (this.state === FutureState.REJECTED && !chain.length) throw this.error
    while (chain.length) {
      const future = chain.shift()!
      if (this.state === FutureState.RESOLVED) future.resolve(this.result!)
      if (this.state === FutureState.REJECTED) future.reject(this.error!)
    }
  }
  resolve(value: T | PromiseLike<T>) {
    if (this.state !== FutureState.OPEN) return
    this.state = FutureState.PENDING
    if (isPromiseLike(value)) this.pipe(value)
    else {
      this.result = value
      this.state = FutureState.RESOLVED
      this.handleChain(this.chained)
    }
  }
  reject(error: E | PromiseLike<T>) {
    if (this.state !== FutureState.OPEN) return
    this.state = FutureState.PENDING
    queueMicrotask(() => {
      if (isPromiseLike(error)) this.pipe(error)
      else {
        this.error = error
        this.state = FutureState.REJECTED
        this.handleChain(this.chained)
      }
    })
  }
  chained: WithResolvers<T, E>[] = []
  then<S, R>(
    res?: ThenCatchFinallyCallback<T, S>,
    rej?: ThenCatchFinallyCallback<E, R>,
  ): Future<S | R, E> {
    const future = Future.From(res, rej)
    if (this.state & (FutureState.OPEN | FutureState.PENDING))
      this.chained.push(future)
    else this.handleChain(future)
    return future.future
  }
  catch<R = T>(rej?: ThenCatchFinallyCallback<E, R>): Future<T | R, E> {
    return this.then(null, rej)
  }
  finally(final: () => void): Future<T, E> {
    const future = Future.From<T, E>(null, null, final)
    this.chained.push(future)
    return future.future
  }

  static From<T, E, S = T, R = S>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tRes?: ThenCatchFinallyCallback<T, S>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tRej?: ThenCatchFinallyCallback<E, R>,
    tFin?: () => void,
  ): WrappedFuture<T, E, S, R> {
    const future = new Future<S | R, E>()
    return new WrappedFuture(future, tRes, tRej, tFin)
  }
}

class WrappedFuture<T, E, S = T, R = S> implements WithResolvers<T, E> {
  constructor(
    public future: Future<S | R, E>,
    tRes?: ThenCatchFinallyCallback<T, S>,
    tRej?: ThenCatchFinallyCallback<E, R>,
    tFin?: () => void,
  ) {
    this.resolve = (res: T) => {
      tFin?.()
      const out = tRes?.(res) ?? res
      future.resolve(out as S | R | PromiseLike<S | R>)
    }
    this.reject = (rej: E) => {
      tFin?.()
      if (!tRej) return future.reject(rej)
      future.resolve(tRej(rej))
    }
  }
  resolve: (res: T) => void
  reject: (rej: E) => void
}

type FutureOf<T> = T extends Promise<infer P> ? P & T : T & Promise<T>

type _FutureProps<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends (...args: infer A) => infer R
        ? (...args: A) => FutureOf<R>
        : T[K] extends Promise<infer P>
          ? FutureOf<P>
          : T[K]
    }
  : T extends Promise<infer P>
    ? FutureOf<P>
    : T & Promise<T>

const _handlers: ProxyHandler<(() => void) & { promise: Promise<unknown> }> = {
  apply({ promise: target }, thisArg, argArray) {
    console.log(target, thisArg, argArray)
    // biome-ignore lint/suspicious/noExplicitAny: Needed for internal variance
    return Reflect.apply(target as any, thisArg, argArray)
  },
  construct({ promise: target }, argArray, newTarget) {
    console.log('constructing', target, argArray, newTarget)
    // biome-ignore lint/suspicious/noExplicitAny: Needed for internal variance
    return Reflect.construct(target as any, argArray, newTarget)
  },
  defineProperty({ promise: target }, prop, descriptor) {
    console.log('defining', target, prop, descriptor)
    return Reflect.defineProperty(target, prop, descriptor)
  },
  deleteProperty({ promise: target }, prop) {
    console.log('deleting', target, prop)
    return Reflect.deleteProperty(target, prop)
  },
  get({ promise: target }, prop, receiver) {
    console.log('getting', target, prop, receiver, Reflect.get(target, prop))
    Reflect.get(target, prop)
  },
  getOwnPropertyDescriptor({ promise: target }, prop) {
    console.log('getting own', target, prop)
    return Reflect.getOwnPropertyDescriptor(target, prop)
  },
  getPrototypeOf({ promise: target }) {
    console.log('getting proto', target)
    return Reflect.getPrototypeOf(target)
  },
  has({ promise: target }, prop) {
    console.log('has', target, prop)
    return Reflect.has(target, prop)
  },
  isExtensible({ promise: target }) {
    console.log('is extensible', target)
    return Reflect.isExtensible(target)
  },
  ownKeys({ promise: target }) {
    console.log('own keys', target)
    return Reflect.ownKeys(target)
  },
  preventExtensions({ promise: target }) {
    console.log('prevent extensions', target)
    return Reflect.preventExtensions(target)
  },
  set({ promise: target }, prop, value, receiver) {
    console.log('setting', target, prop, value, receiver)
    return Reflect.set(target, prop, value, receiver)
  },
  setPrototypeOf({ promise: target }, proto) {
    console.log('setting proto', target, proto)
    return Reflect.setPrototypeOf(target, proto)
  },
}

const isPromiseLike = <T>(value: unknown): value is PromiseLike<T> =>
  typeof value === 'object' && value !== null && 'then' in value

type MaybeArray<T> = T | T[]
