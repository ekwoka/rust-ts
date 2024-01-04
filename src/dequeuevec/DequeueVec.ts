export class DequeueVec<T> {
  length: number = 0;
  buffer: T[];
  head: number = 0;
  tail: number = 0;
  size: number = 0;
  constructor(initializer: Array<T> | number = 0) {
    if (typeof initializer === 'number') {
      this.buffer = new Array(initializer);
      this.size = initializer;
    } else {
      this.buffer = initializer.slice();
      this.size = initializer.length;
      this.length = initializer.length;
      this.tail = initializer.length;
    }
  }
  at(i: number) {
    const idx = (i + this.size) % this.size;
    if (idx < 0 || idx > this.length) return undefined;
    return this.buffer[(this.head + idx) % this.size];
  }
  get(i: number) {
    if (i < 0 || i > this.length) return undefined;
    return this.buffer[(this.head + i) % this.size];
  }
  set(i: number, v: T) {
    if (i < 0 || i > this.length) return;
    this.buffer[(this.head + i) % this.size] = v;
  }
  push(v: T) {
    this.buffer[this.tail] = v;
    this.tail = (this.tail + 1) % this.size;
    this.length++;
  }
  pop() {
    this.tail = this.tail ? this.tail - 1 : this.size - 1;
    const v = this.buffer[this.tail];
    this.buffer[this.tail] = undefined as unknown as T;
    this.length--;
    return v;
  }
  unshift(v: T) {
    this.head = this.head ? this.head - 1 : this.size - 1;
    this.buffer[this.head] = v;
    this.length++;
  }
  shift() {
    const v = this.buffer[this.head];
    this.buffer[this.head] = undefined as unknown as T;
    this.head = (this.head + 1) % this.size;
    this.length--;
    return v;
  }
  first() {
    return this.buffer[this.head];
  }
  last() {
    return this.buffer[this.tail ? this.tail - 1 : this.size - 1];
  }

  static from<T>(
    opt: { length: number },
    mapper: (v: number, i: number) => T,
  ): DequeueVec<T> {
    const buff = new DequeueVec<T>(opt.length);
    for (let i = 0; i < opt.length; i++) {
      buff.push(mapper(i, i));
    }
    return buff;
  }
}
