const { src, dest, series } = require('gulp');
const { rollup } = require('rollup');
const { mkdirSync } = require('fs');
const { sync } = require('del');
const configs = require('./rollup.config');

function clean(callback) {
    sync(['dist']);
    mkdirSync('dist', { recursive: true });
    callback();
}

async function build() {

    for (const index in configs.default) {
        let conf = configs.default[index];

        const bundle = await rollup({
            input: conf.input,
            plugins: conf.plugins
        }).catch(err => console.log(err));;
        await bundle.generate({
            output: conf.output,
        });
        await bundle.write({
            output: conf.output
        });
        await bundle.close();
    }
}

function copyfiles() {
    return src(['d/toc.d.ts']).pipe(dest('dist'));
}

exports.default = series(clean, build, copyfiles);