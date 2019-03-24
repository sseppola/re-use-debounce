import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'ts-dist/useDebounce.js',
    output: {
      name: 'useDebounce',
      file: pkg.browser,
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
    plugins: [resolve(), commonjs()],
    external: ['react', 'lodash/debounce'],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'ts-dist/useDebounce.js',
    external: ['react', 'lodash/debounce'],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
  },
];
