import { tryFetch } from '@/upgrade/tryFetch';

describe('tryFetch', () => {
  it('can fetch results', async () => {
    const res = await tryFetch(URL.createObjectURL(new Blob([`hello world`])));
    expect(res.isOk()).toBeTruthy();
    expect(res.unwrap()).toBeInstanceOf(Response);
    const errRes = await tryFetch('http://localhost:9999');
    expect(errRes.isErr()).toBeTruthy();
    expect(errRes.unwrapErr()).toBeInstanceOf(TypeError);
  });
});
