/**
 * Vectors represent a coordinate in a multi-dimensional space.
 *
 * @module Vector
 */
import { RustIterator } from './iterators/RustIterator.js'

/**
 * A vector of N dimensions.
 *
 *  *
 * @groupdescription Vector
 *
 * @groupdescription Math
 * @groupdescription Static Math
 *
 * @groupdescription Equality
 *
 * @groupdescription Iterable
 *
 * @groupdescription From
 * @groupdescription Static From
 *
 * @groupdescription To
 * @groupdescription Static To
 *
 * @groupdescription Prebuilt Vectors
 */
export interface Vector<N extends number> {
  /**
   * Adds another Vec to the current Vec returning a new Vec
   *
   * @remarks
   * This can be used to "move" a position vector
   * along a velocity vector.
   *
   * @group Math
   */
  add(rhs: Vector<N>): Vector<N>

  /**
   * Subtracts another Vec from the current Vec returning a new Vec
   *
   * @remarks
   * This can be used to get a velocity vector representing the difference between two position vectors.
   *
   * @group Math
   */
  sub(rhs: Vector<N>): Vector<N>

  /**
   * Multiplies another Vec with the current Vec returning a new Vec
   *
   *
   * @group Math
   */
  mult(rhs: Vector<N>): Vector<N>

  /**
   * Divides another Vec with the current Vec returning a new Vec
   *
   * @group Math
   */
  div(rhs: Vector<N>): Vector<N>

  /**
   * Returns the partwise minimum of the current Vec and another Vec
   *
   * @group Math
   */
  min(rhs: Vector<N>): Vector<N>

  /**
   * Returns the partwise maximum of the current Vec and another Vec
   *
   * @group Math
   */
  max(rhs: Vector<N>): Vector<N>

  /**
   * Returns a new Vec representing the current Vec clamped between a minimum and maximum Vec
   *
   * @group Math
   */
  clamp(min: Vector<N>, max: Vector<N>): Vector<N>

  /**
   * Returns the partwise absolute value of the current Vec
   *
   * @group Math
   */
  abs(): Vector<N>

  /**
   * Returns the partwise ceiling of the current Vec
   *
   * @group Math
   */
  ceil(): Vector<N>

  /**
   * Returns the partwise floor of the current Vec
   *
   * @group Math
   */
  floor(): Vector<N>

  /**
   * Returns the partwise rounded value of the current Vec
   *
   * @group Math
   */
  round(): Vector<N>

  /**
   * Returns a new Vec that is the current Vec with all parts multiplied by a scalar
   *
   * @group Math
   */
  scale(scalar: number): Vector<N>

  /**
   * Returns the dot product of the current Vec and another Vec
   *
   * @remarks
   * The dot product is the sum of the products of the corresponding entries of the two Vecs. ie. `a.x * b.x + a.y * b.y + ...`
   *
   * @group Math
   */
  dot(rhs: Vector<N>): number

  /**
   * Returns the length of the current Vec
   *
   * @remarks
   * The length is the magnitude of the Vec treated as a vector from the origin to the point represented by the Vec.
   *
   * @group Math
   */
  length(): number

  /**
   * Returns a new Vec that is the current Vec normalized to a length of 1
   *
   * @remarks
   * The normalized Vec has the same direction as the original Vec but a length of 1.
   * This is useful for representing directions without regard to magnitude.
   *
   * @group Math
   */
  normalize(): Vector<N>

  /**
   * Returns the projection of the current Vec onto another Vec
   *
   * @remarks
   * The projection is the part of the current Vec that lies in the direction of the other Vec.
   *
   * @group Math
   */
  projectOnto(rhs: Vector<N>): Vector<N>

  /**
   * Returns the rejection of the current Vec from another Vec
   *
   * @remarks
   * The rejection is the part of the current Vec that lies perpendicular to the other Vec.
   *
   * @group Math
   */
  rejectFrom(rhs: Vector<N>): Vector<N>

  /**
   * Returns the distance between the current Vec and another Vec
   *
   * @remarks
   * The distance is the magnitude of the difference between the two Vecs.
   * This is equivalent to {@linkcode sub|a.sub(b)} {@linkcode Vector#length|.length()}.
   *
   * @group Math
   */
  distance(rhs: Vector<N>): number

  /**
   * Returns the midpoint between the current Vec and another Vec
   *
   * @group Math
   */
  midPoint(rhs: Vector<N>): Vector<N>

  /**
   * Returns a new Vec that is the current Vec moved towards another Vec by a certain distance
   * @remarks functionally equivalent to `a.add(b.sub(a).normalize().scale(distance))`
   * @group Math
   */
  moveTowards(rhs: Vector<N>, distance: number): Vector<N>
  lerp(rhs: Vector<N>, t: number): Vector<N>

  /**
   * Returns an iterator over the points between the current Vec and another Vec
   *
   * @group Math
   */
  between(
    rhs: Vector<N>,
    incStart: boolean,
    incEnd: boolean,
  ): IterableIterator<Vector<N>>

  /**
   * Returns an array representation of the current Vec
   *
   * @group To
   */
  toArray(): number[]

  /**
   * Returns a string representation of the current Vec
   *
   * @group To
   */
  toString(): string

  /**
   * Returns an iterator over the parts of the current Vec
   *
   * @group To
   */
  toIter(): RustIterator<number>
}

/**
 * A 2-dimensional vector.
 */
export class Vec2 implements Vector<2>, Iterable<number> {
  /**
   * Creates a new 2-dimensional vector
   */
  constructor(
    public x: number,
    public y: number,
  ) {}

  add(rhs: Vec2): Vec2 {
    return new Vec2(this.x + rhs.x, this.y + rhs.y)
  }

  sub(rhs: Vec2): Vec2 {
    return new Vec2(this.x - rhs.x, this.y - rhs.y)
  }

  mult(rhs: Vec2): Vec2 {
    return new Vec2(this.x * rhs.x, this.y * rhs.y)
  }

  div(rhs: Vec2): Vec2 {
    return new Vec2(this.x / rhs.x, this.y / rhs.y)
  }

  min(rhs: Vec2): Vec2 {
    return new Vec2(Math.min(this.x, rhs.x), Math.min(this.y, rhs.y))
  }

  max(rhs: Vec2): Vec2 {
    return new Vec2(Math.max(this.x, rhs.x), Math.max(this.y, rhs.y))
  }

  clamp(min: Vec2, max: Vec2): Vec2 {
    return new Vec2(
      Math.min(max.x, Math.max(min.x, this.x)),
      Math.min(max.y, Math.max(min.y, this.y)),
    )
  }

  abs(): Vec2 {
    return new Vec2(Math.abs(this.x), Math.abs(this.y))
  }

  ceil(): Vec2 {
    return new Vec2(Math.ceil(this.x), Math.ceil(this.y))
  }

  floor(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y))
  }

  round(): Vec2 {
    return new Vec2(Math.round(this.x), Math.round(this.y))
  }

  scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  normalize(): Vec2 {
    const length = this.length()
    return new Vec2(this.x / length, this.y / length)
  }

  projectOnto(rhs: Vec2): Vec2 {
    const normalized = rhs.normalize()
    return normalized.scale(this.dot(normalized))
  }

  rejectFrom(rhs: Vec2): Vec2 {
    return this.sub(this.projectOnto(rhs))
  }

  distance(rhs: Vec2): number {
    return this.sub(rhs).length()
  }

  midPoint(rhs: Vec2): Vec2 {
    return this.add(rhs).scale(0.5)
  }

  moveTowards(rhs: Vec2, distance: number): Vec2 {
    if (distance === 0) return new Vec2(this.x, this.y)
    if (distance === 100) return new Vec2(rhs.x, rhs.y)
    const diff = rhs.sub(this)
    const length = diff.length()
    const percentage = Math.max(Math.min(100, distance), 0) / 100
    return this.add(diff.normalize().scale(length * percentage))
  }

  lerp(rhs: Vec2, t: number): Vec2 {
    if (t === 0) return new Vec2(this.x, this.y)
    if (t === 100) return new Vec2(rhs.x, rhs.y)
    const diff = rhs.sub(this)
    const length = diff.length()
    return this.add(diff.normalize().scale((t / 100) * length))
  }

  *between(
    rhs: Vec2,
    incStart = false,
    incEnd = incStart,
  ): IterableIterator<Vec2> {
    if (incStart) yield this
    const diff = rhs.sub(this)
    const length = diff.length()
    const step = diff.normalize()
    for (let i = 1; i < length; i++) yield this.add(step.scale(i))
    if (incEnd) yield rhs
  }

  /** @group To */
  toArray(): number[] {
    return [this.x, this.y]
  }

  /** @group To */
  toString(): string {
    return this.toArray().join(',')
  }

  /** @group To */
  toIter(): RustIterator<number> {
    return new RustIterator(this.toArray())
  }

  /**
   * Implements the iterable protocol.
   * @group Iterable
   */
  [Symbol.iterator](): Iterator<number> {
    return this.toIter()
  }

  /** @group To */
  toAngle(): number {
    return (Math.atan2(this.y, this.x) * 180) / Math.PI
  }

  /** @group Equality */
  eq(rhs: Vec2): boolean {
    return this.x === rhs.x && this.y === rhs.y
  }

  clone() {
    return new Vec2(this.x, this.y)
  }

  /** @group From */
  // biome-ignore lint/complexity/noBannedTypes: <Want a String>
  static from(str: string | String): Vec2
  static from(iter: Iterable<number>): Vec2
  static from(iter: Iterable<string>): Vec2
  static from(v: string | Iterable<string> | Iterable<number>): Vec2 {
    const [x = 0, y = 0] =
      typeof v === 'string' || v instanceof String
        ? v.split(',').map(Number)
        : v
    return new Vec2(Number(x), Number(y))
  }

  /** @group From */
  static fromAngle(angle: number): Vec2 {
    const rads = (angle * Math.PI) / 180
    return new Vec2(Math.cos(rads), Math.sin(rads))
  }

  /** @group Prebuilt Vectors */
  static get ZERO(): Vec2 {
    return new Vec2(0, 0)
  }

  /** @group Prebuilt Vectors */
  static get ONE(): Vec2 {
    return new Vec2(1, 1)
  }

  /** @group Prebuilt Vectors */
  static get NEG_ONE(): Vec2 {
    return new Vec2(-1, -1)
  }

  /** @group Prebuilt Vectors */
  static get MIN(): Vec2 {
    return new Vec2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)
  }

  /** @group Prebuilt Vectors */
  static get MAX(): Vec2 {
    return new Vec2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  }

  /** @group Prebuilt Vectors */
  static get INFINITY(): Vec2 {
    return new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
  }

  /** @group Prebuilt Vectors */
  static get NEG_INFINITY(): Vec2 {
    return new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
  }

  /** @group Prebuilt Vectors */
  static get NaN(): Vec2 {
    return new Vec2(Number.NaN, Number.NaN)
  }

  /** @group Prebuilt Vectors */
  static get X(): Vec2 {
    return new Vec2(1, 0)
  }

  /** @group Prebuilt Vectors */
  static get Y(): Vec2 {
    return new Vec2(0, 1)
  }

  /** @group Prebuilt Vectors */
  static get NEG_X(): Vec2 {
    return new Vec2(-1, 0)
  }

  /** @group Prebuilt Vectors */
  static get NEG_Y(): Vec2 {
    return new Vec2(0, -1)
  }

  /** @group From */
  static splat(n: number): Vec2 {
    return new Vec2(n, n)
  }

  /** @group From */
  static select(mask: Vec2, a: Vec2, b: Vec2): Vec2 {
    return new Vec2(mask.x === 1 ? a.x : b.x, mask.y === 1 ? a.y : b.y)
  }

  /** @group Static Math */
  static add(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.add(rhs)
  }

  /** @group Static Math */
  static sub(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.sub(rhs)
  }

  /** @group Static Math */
  static scale(scalar: number) {
    return (vec: Vec2) => vec.scale(scalar)
  }

  /** @group Static Math */
  static dot(lhs: Vec2, rhs: Vec2): number {
    return lhs.dot(rhs)
  }

  /** @group Static Math */
  static dotApply(lhs: Vec2): (rhs: Vec2) => number {
    return (rhs: Vec2) => lhs.dot(rhs)
  }

  /** @group Static Math */
  static length(vec: Vec2): number {
    return vec.length()
  }

  /** @group Static Math */
  static normalize(vec: Vec2): Vec2 {
    return vec.normalize()
  }

  /** @group Static Math */
  static clamp(min: Vec2, max: Vec2) {
    return (vec: Vec2) => vec.clamp(min, max)
  }

  /** @group Static To */
  static toArray(vec: Vec2): number[] {
    return vec.toArray()
  }

  /** @group Static To */
  static toString(vec: Vec2): string {
    return vec.toString()
  }

  /** @group Static To */
  static toIter(vec: Vec2): RustIterator<number> {
    return vec.toIter()
  }

  /** @group Static To */
  static toAngle(vec: Vec2): number {
    return vec.toAngle()
  }
}

/**
 * A 3-dimensional vector.
 */
export class Vec3 implements Vector<3> {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  mult(v: Vec3): Vec3 {
    return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z)
  }

  div(v: Vec3): Vec3 {
    return new Vec3(this.x / v.x, this.y / v.y, this.z / v.z)
  }

  min(v: Vec3): Vec3 {
    return new Vec3(
      Math.min(this.x, v.x),
      Math.min(this.y, v.y),
      Math.min(this.z, v.z),
    )
  }

  max(v: Vec3): Vec3 {
    return new Vec3(
      Math.max(this.x, v.x),
      Math.max(this.y, v.y),
      Math.max(this.z, v.z),
    )
  }

  clamp(min: Vec3, max: Vec3): Vec3 {
    return new Vec3(
      Math.min(max.x, Math.max(min.x, this.x)),
      Math.min(max.y, Math.max(min.y, this.y)),
      Math.min(max.z, Math.max(min.z, this.z)),
    )
  }

  abs(): Vec3 {
    return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
  }

  ceil(): Vec3 {
    return new Vec3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z))
  }

  floor(): Vec3 {
    return new Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z))
  }

  round(): Vec3 {
    return new Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z))
  }

  scale(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
  }

  normalize(): Vec3 {
    const length = this.length()
    return new Vec3(this.x / length, this.y / length, this.z / length)
  }

  projectOnto(rhs: Vec3): Vec3 {
    const normalized = rhs.normalize()
    return normalized.scale(this.dot(normalized))
  }

  rejectFrom(rhs: Vec3): Vec3 {
    return this.sub(this.projectOnto(rhs))
  }

  distance(v: Vec3): number {
    return this.sub(v).length()
  }

  midPoint(v: Vec3): Vec3 {
    return this.add(v).scale(0.5)
  }

  moveTowards(rhs: Vec3, distance: number): Vec3 {
    if (distance === 0) return new Vec3(this.x, this.y, this.z)
    if (distance === 100) return new Vec3(rhs.x, rhs.y, rhs.z)
    const diff = rhs.sub(this)
    const length = diff.length()
    const percentage = Math.max(Math.min(100, distance), 0) / 100
    return this.add(diff.normalize().scale(length * percentage))
  }

  lerp(rhs: Vec3, t: number): Vec3 {
    if (t === 0) return new Vec3(this.x, this.y, this.z)
    if (t === 100) return new Vec3(rhs.x, rhs.y, rhs.z)
    const diff = rhs.sub(this)
    const length = diff.length()
    return this.add(diff.normalize().scale((t / 100) * length))
  }

  *between(
    rhs: Vec3,
    incStart = false,
    incEnd = incStart,
  ): IterableIterator<Vec3> {
    if (incStart) yield this
    const diff = rhs.sub(this)
    const length = diff.length()
    const step = diff.normalize()
    for (let i = 1; i < length; i++) yield this.add(step.scale(i))
    if (incEnd) yield rhs
  }

  toArray(): number[] {
    return [this.x, this.y, this.z]
  }

  toString(): string {
    return this.toArray().join(',')
  }

  toIter(): RustIterator<number> {
    return new RustIterator(this.toArray())
  }

  [Symbol.iterator](): Iterator<number> {
    return this.toIter()
  }

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  static from(str: string | String): Vec3
  static from(iter: Iterable<number>): Vec3
  static from(iter: Iterable<string>): Vec3
  static from(v: string | Iterable<string> | Iterable<number>): Vec3 {
    const [x = 0, y = 0, z = 0] =
      typeof v === 'string' || v instanceof String
        ? v.split(',').map(Number)
        : v
    return new Vec3(Number(x), Number(y), Number(z))
  }

  static get ZERO(): Vec3 {
    return new Vec3(0, 0, 0)
  }

  static get ONE(): Vec3 {
    return new Vec3(1, 1, 1)
  }

  static get NEG_ONE(): Vec3 {
    return new Vec3(-1, -1, -1)
  }

  static get MIN(): Vec3 {
    return new Vec3(
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    )
  }

  static get MAX(): Vec3 {
    return new Vec3(
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    )
  }

  static get INFINITY(): Vec3 {
    return new Vec3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    )
  }

  static get NEG_INFINITY(): Vec3 {
    return new Vec3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    )
  }

  static get NaN(): Vec3 {
    return new Vec3(Number.NaN, Number.NaN, Number.NaN)
  }

  static get X(): Vec3 {
    return new Vec3(1, 0, 0)
  }

  static get Y(): Vec3 {
    return new Vec3(0, 1, 0)
  }

  static get Z(): Vec3 {
    return new Vec3(0, 0, 1)
  }

  static get NEG_X(): Vec3 {
    return new Vec3(-1, 0, 0)
  }

  static get NEG_Y(): Vec3 {
    return new Vec3(0, -1, 0)
  }

  static get NEG_Z(): Vec3 {
    return new Vec3(0, 0, -1)
  }

  static splat(n: number): Vec3 {
    return new Vec3(n, n, n)
  }

  static select(mask: Vec3, a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      mask.x === 1 ? a.x : b.x,
      mask.y === 1 ? a.y : b.y,
      mask.z === 1 ? a.z : b.z,
    )
  }

  static add(lhs: Vec3, rhs: Vec3): Vec3 {
    return lhs.add(rhs)
  }

  static sub(lhs: Vec3, rhs: Vec3): Vec3 {
    return lhs.sub(rhs)
  }

  static scale(scalar: number) {
    return (vec: Vec3) => vec.scale(scalar)
  }

  static dot(lhs: Vec3, rhs: Vec3): number {
    return lhs.dot(rhs)
  }

  static length(vec: Vec3): number {
    return vec.length()
  }

  static normalize(vec: Vec3): Vec3 {
    return vec.normalize()
  }

  static clamp(min: Vec3, max: Vec3) {
    return (vec: Vec3) => vec.clamp(min, max)
  }

  static toArray(vec: Vec3): number[] {
    return vec.toArray()
  }

  static toString(vec: Vec3): string {
    return vec.toString()
  }

  static toIter(vec: Vec3): RustIterator<number> {
    return vec.toIter()
  }
}
