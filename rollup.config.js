import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import inject from '@rollup/plugin-inject';

const packageJson = require('./package.json');

const externalDeps = Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.peerDependencies));

const getOutput = (path, format) => ({
  file: path,
  format: format,
  sourcemap: true,
  compact: true,
  exports: 'named'
});

const getConfig = withPolyfill => ({
  input: 'src/index.ts',
  output: withPolyfill
    ? [getOutput('build/withPolyfill.js', 'cjs')]
    : [getOutput(packageJson.main, 'cjs'), getOutput(packageJson.module, 'esm')],
  external: externalDeps,
  plugins: [resolve(), commonjs(), typescript({ useTsconfigDeclarationDir: true })].concat(
    withPolyfill ? [inject({ ResizeObserver: 'resize-observer-polyfill' })] : []
  )
});

export default [getConfig(), getConfig(true)];
