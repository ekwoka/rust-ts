/**
 * @module Option
 */
/** @ignore */
import { None as none } from './Option.js'

/** @ignore */
export type { Option } from './Option.js'
/** @ignore */
export { Some } from './Option.js'

/** A premade {@linkcode None} for use */
export const None = new none()
