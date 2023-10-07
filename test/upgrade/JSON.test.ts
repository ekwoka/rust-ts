import '@/upgrade/JSON';

describe('JSON', () => {
  it('can tryParse', () => {
    expect(JSON.tryParse('{"foo":"bar"}').unwrap()).toEqual({ foo: 'bar' });
    expect(JSON.tryParse('{foo: "bar"}').unwrapErr()).toEqual(
      new SyntaxError("Expected property name or '}' in JSON at position 1"),
    );
  });

  it('can tryStringify', () => {
    expect(JSON.tryStringify({ foo: 'bar' }).unwrap()).toEqual('{"foo":"bar"}');
    expect(JSON.tryStringify({ foo: 15n }).unwrapErr()).toEqual(
      new TypeError('Do not know how to serialize a BigInt'),
    );
  });
});
