import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json';

import pkg from './package.json'

export default {
	input: 'index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		},
		{
			file: pkg.module,
			format: 'es'
		}
	],
	external: [
		'home-dir'
	],
	plugins: [
		json({
			exclude: 'node_modules/**',
			preferConst: true,
		}),
		resolve(),
		commonjs()
	]
}
