import { build } from 'esbuild';
import prettyBytes from 'pretty-bytes';

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { brotliCompressSync } from 'node:zlib';

const { outputFiles } = await build({
  entryPoints: ['./src/index.ts'],
  inject: [],
  write: false,
  splitting: false,
  format: 'esm',
  bundle: true,
  target: 'esnext',
  platform: 'node',
  minify: true,
  plugins: [],
});
const { minified, brotli } = getSizes(outputFiles[0].contents);
const content = JSON.stringify(
  {
    minified,
    brotli,
  },
  null,
  2
);
const old = JSON.parse(await readFile(join('size.json'), 'utf8'));
await writeFile(join('size.json'), content, 'utf8');
console.log(
  `Package size: ${old.minified.pretty} => ${minified.pretty}: ${prettyBytes(
    minified.raw - old.minified.raw
  )}`
);
console.log(
  `Brotli size: ${old.brotli.pretty} => ${brotli.pretty}: ${prettyBytes(
    brotli.raw - old.brotli.raw
  )}`
);

function sizeInfo(bytesSize) {
  return {
    pretty: prettyBytes(bytesSize),
    raw: bytesSize,
  };
}

function getBytes(str) {
  return Buffer.byteLength(str, 'utf8');
}

function getSizes(code) {
  const minifiedSize = getBytes(code);
  const brotliSize = getBytes(brotliCompressSync(code));

  return { minified: sizeInfo(minifiedSize), brotli: sizeInfo(brotliSize) };
}
