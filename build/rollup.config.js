import nodeResolve from 'rollup-plugin-node-resolve';
import angular from 'rollup-plugin-angular';

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',

    'rxjs/Observable': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',

    'rxjs/add/observable/combineLatest': 'Rx.Observable',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/do': 'Rx.Observable.prototype',
    'rxjs/add/operator/distinctUntilChanged': 'Rx.Observable.prototype',

    'z-schema': 'ZSchema'
};

export default {
    entry: 'dist/index.js',
    dest: 'dist/schema-form.umd.js',
    format: 'umd',
    moduleName: 'schemaForm',
    globals,
    external: Object.keys(globals),
    plugins: [
        angular(),
        nodeResolve({})
    ],
    // onwarn: (warning) => {
    //     const skip_codes = [
    //         'THIS_IS_UNDEFINED',
    //         'MISSING_GLOBAL_NAME'
    //     ];
    //     if (skip_codes.indexOf(warning.code) != -1) return;
    //     console.error(warning);
    // }
}
