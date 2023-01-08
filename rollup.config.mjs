import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

import packageJson from './package.json' assert { type: 'json' };

const externalDeps = Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.peerDependencies));

const getOutput = (path, format) => ({
  file: path,
  format: format,
  sourcemap: true,
  compact: true,
  exports: 'named'
});

const getConfig = () => ({
  input: 'src/index.ts',
  output: [getOutput(packageJson.main, 'cjs'), getOutput(packageJson.module, 'esm')],
  external: externalDeps,
  plugins: [
    externals(),
    resolve(),
    commonjs(),
    typescript(),
    terser()
  ]
});

export default [getConfig()];
