import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const plugins = [
  peerDepsExternal(),
  resolve(),
  replace({
    __IS_DEV__: process.env.NODE_ENV === 'development',
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    useTsconfigDeclarationDir: true,
  }),
  terser(),
];

export default [
  {
    input: 'src/index.ts',
    output: [
      // We're only keeping the ESM format since it supports top-level await
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
      // Optionally, you can add a system format output which also supports top-level await
      {
        file: pkg.main,
        format: 'system',
        sourcemap: true,
        exports: 'named',
      },
    ],
    ...{
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
      preserveSymlinks: true,
      plugins,
    },
  },
];
