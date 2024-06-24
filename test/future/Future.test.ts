import { Future } from '@/future/Future'

describe('Future', () => {
  describe('Implements Promise', () => {
    it('provides Resolve and Reject callbacks to the constructor', ({
      expect,
    }) => {
      new Future((resolve, reject) => {
        expect(typeof resolve).toBe('function')
        expect(typeof reject).toBe('function')
      })
    })
    it('passes resolved value to the .then callback', ({ expect }) => {
      new Future((resolve) => resolve(1)).then((value) => expect(value).toBe(1))
    })
    it('passes rejected value to the .catch callback', ({ expect }) => {
      new Future((_res, reject) => reject(2)).catch((value) =>
        expect(value).toBe(2),
      )
    })
    it('calls .finally callback when resolved', ({ expect }) => {
      new Future((resolve) => resolve(1)).finally(() => expect(true).toBe(true))
    })
    it('calls .finally callback when rejected', ({ expect }) => {
      new Future((_res, reject) => reject(2))
        .finally(() => expect(true).toBe(true))
        // biome-ignore lint/suspicious/noEmptyBlockStatements: Needed for test
        .catch(() => {})
    })
    it('chains .then into new promises', ({ expect }) => {
      new Future<number, never>((resolve) => resolve(1))
        .then((value) => value + 1)
        .then((value) => expect(value).toBe(2))
    })
    it('chains .catch into new promises', ({ expect }) => {
      new Future<never, number>((_res, reject) => reject(2))
        .catch((value) => value + 1)
        .then((value) => expect(value).toBe(3))
    })
    it('passes rejections through .then', ({ expect }) => {
      new Future<number, number>((_res, reject) => reject(1))
        .then((value) => value + 2)
        .catch((value) => value + 1)
        .then((value) => expect(value).toBe(2))
    })
    it('with multiple thens for same promise', () => {
      const checkFunc = (v: number) => expect(v).toEqual(42)
      const mainPromise = Promise.resolve(42)
      const promise1 = mainPromise.then(checkFunc)
      const promise2 = mainPromise.then(checkFunc)
      return Promise.allSettled([promise1, promise2])
    })
  })
})

describe('Promise', () => {
  it('provides Resolve and Reject callbacks to the constructor', ({
    expect,
  }) => {
    new Promise((resolve, reject) => {
      expect(typeof resolve).toBe('function')
      expect(typeof reject).toBe('function')
    })
  })
  it('passes resolved value to the .then callback', ({ expect }) => {
    new Promise((resolve) => resolve(1)).then((value) => expect(value).toBe(1))
  })
  it('passes rejected value to the .catch callback', ({ expect }) => {
    new Promise((_res, reject) => reject(2)).catch((value) =>
      expect(value).toBe(2),
    )
  })
  it('calls .finally callback when resolved', ({ expect }) => {
    new Promise((resolve) => resolve(1)).finally(() => expect(true).toBe(true))
  })
  it('calls .finally callback when rejected', ({ expect }) => {
    new Promise((_res, reject) => reject(2))
      .finally(() => expect(true).toBe(true))
      // biome-ignore lint/suspicious/noEmptyBlockStatements: Needed for test
      .catch(() => {})
  })
  it('chains .then into new promises', ({ expect }) => {
    new Promise<number>((resolve) => resolve(1))
      .then((value) => value + 1)
      .then((value) => expect(value).toBe(2))
  })
  it('chains .catch into new promises', ({ expect }) => {
    new Promise<number>((_res, reject) => reject(2))
      .catch((value) => value + 1)
      .then((value) => expect(value).toBe(3))
  })
  it('passes rejections through .then', ({ expect }) => {
    new Promise<number>((_res, reject) => reject(1))
      .then((value) => value + 2)
      .catch((value) => value + 1)
      .then((value) => expect(value).toBe(2))
  })
  it('with multiple thens for same promise', () => {
    const checkFunc = (v: number) => expect(v).toEqual(42)
    const mainPromise = Promise.resolve(42)
    const promise1 = mainPromise.then(checkFunc)
    const promise2 = mainPromise.then(checkFunc)
    return Promise.allSettled([promise1, promise2])
  })
})
