import { type Result, Try } from '../result'

if (!JSON.tryParse) {
  JSON.tryParse = (json) => Try(() => JSON.parse(json))
  JSON.tryStringify = (value) => Try(() => JSON.stringify(value))
}

declare global {
  interface JSON {
    tryParse<T>(json: string): Result<T, SyntaxError>
    tryStringify<T>(value: T): Result<string, TypeError>
  }
}
