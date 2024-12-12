import externals from 'rollup-plugin-node-externals';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const getConfig = () => ({
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: [externals(), resolve(), commonjs(), typescript()]
});

export default [getConfig()];
