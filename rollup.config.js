import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'js/main.js',
        output: {
            file: 'dist/js/main.min.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [
            babel({
                exclude: 'node_modules/**'
            }),
            terser()
        ]
    },
    {
        input: 'js/search.js',
        output: {
            file: 'dist/js/search.min.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [
            babel({
                exclude: 'node_modules/**'
            }),
            terser()
        ]
    },
    {
        input: 'js/interactive.js',
        output: {
            file: 'dist/js/interactive.min.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [
            babel({
                exclude: 'node_modules/**'
            }),
            terser()
        ]
    }
];
