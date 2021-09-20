const { terser } = require("rollup-plugin-terser");
const typescript = require('@rollup/plugin-typescript');
const meta = require('./package.json');

const nowYear = new Date().getFullYear();
const copyright = "Copyright (c) 2021" +
    (nowYear > 2021 ? `-${nowYear}` : "") + " Leisn";

const config = {
    input: 'src/main.ts',
    output: {
        file: 'dist/toc.js',
        name: 'tocjs',
        format: "iife",
        footer: "/*! Thanks for use tocjs.*/",
        interop: false,
        banner: "/*!\n" +
            `  Toc.js v${meta.version}\n` +
            `  ${copyright}\n` +
            `  License: ${meta.license}\n` +
            `  [tocjs](${meta.homepage})\n` +
            "*/"
    },
    plugins: [
        typescript({ tsconfig: './tsconfig.build.json' })
    ]
};

exports.default = [config, {
    ...config,
    output: {
        ...config.output,
        banner: config.output.banner.split(/\n/g).join(' | ').replace(/\s{2,}/g, ' '),
        file: 'dist/toc.min.js'
    },
    plugins: [
        ...config.plugins,
        terser({
            format: {
                max_line_len: 0xFF,
                ascii_only: true,
            },
            compress: {
                ecma: 2015,
                warnings: true,
                toplevel: "funcs"
            }
        })
    ]
}];