import { TryAsync } from '@/result/Result';

export const tryFetch = function tryFetch(url: string, options?: RequestInit) {
  return TryAsync(() => fetch(url, options));
};
