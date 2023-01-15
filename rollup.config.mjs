import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import packageJson from './package.json' assert { type: 'json' };

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
  plugins: [externals(), resolve(), commonjs(), typescript()]
});

export default [getConfig()];
