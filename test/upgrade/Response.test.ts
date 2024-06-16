import { Ok } from '@/result/Result'
import '@/upgrade/Response'

describe('Response', () => {
  it('can tryJson', async () => {
    const res = testResponse()
    expect(await res.tryJson()).toEqual(new Ok({ foo: 'bar' }))
    expect((await res.tryJson()).unwrapErr()).toBeInstanceOf(TypeError)
  })
  it('can tryText', async () => {
    const res = testResponse()
    expect(await res.tryText()).toEqual(new Ok('{"foo":"bar"}'))
    expect((await res.tryText()).unwrapErr()).toBeInstanceOf(TypeError)
  })
  it('can tryArrayBuffer', async () => {
    const res = testResponse()
    expect(await res.tryArrayBuffer()).toEqual(new Ok(new ArrayBuffer(14)))
    expect((await res.tryArrayBuffer()).unwrapErr()).toBeInstanceOf(TypeError)
  })
  it('can tryBlob', async () => {
    const res = testResponse()
    expect((await res.tryBlob()).unwrap()).toBeInstanceOf(Blob)
    expect((await res.tryBlob()).unwrapErr()).toBeInstanceOf(TypeError)
  })
  it('can tryFormData', async () => {
    const res = formResponse()
    expect((await res.tryFormData()).unwrap()).toBeInstanceOf(FormData)
    expect((await res.tryFormData()).unwrapErr()).toBeInstanceOf(TypeError)
  })
})

const testResponse = () => {
  return new Response(JSON.stringify({ foo: 'bar' }))
}

const formResponse = () => {
  const formData = new FormData()
  formData.append('foo', 'bar')
  return new Response(formData)
}
