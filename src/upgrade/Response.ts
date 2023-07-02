import type { Result } from '@/result';
import { TryAsync } from '@/result/Result';

if (!Response.prototype.tryJson) {
  Response.prototype.tryJson = function <T>(): Promise<Result<T, TypeError>> {
    return TryAsync(() => this.json());
  };

  Response.prototype.tryText = function (): Promise<Result<string, TypeError>> {
    return TryAsync(() => this.text());
  };

  Response.prototype.tryArrayBuffer = function (): Promise<
    Result<ArrayBuffer, TypeError | RangeError>
  > {
    return TryAsync(() => this.arrayBuffer());
  };

  Response.prototype.tryBlob = function (): Promise<Result<Blob, TypeError>> {
    return TryAsync(() => this.blob());
  };

  Response.prototype.tryFormData = function (): Promise<
    Result<FormData, TypeError>
  > {
    return TryAsync(() => this.formData());
  };
}

declare global {
  interface Response {
    tryJson<T>(): Promise<Result<T, TypeError | SyntaxError>>;
    tryText(): Promise<Result<string, TypeError>>;
    tryArrayBuffer(): Promise<Result<ArrayBuffer, TypeError | RangeError>>;
    tryBlob(): Promise<Result<Blob, TypeError>>;
    tryFormData(): Promise<Result<FormData, TypeError>>;
  }
}
