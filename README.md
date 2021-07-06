# @omni-door/gulp-plugin-vue-sfc

English | [简体中文](./README.zh-CN.md)

## Quick start

### Install

```shell
yarn add -D @omni-door/gulp-plugin-vue-sfc
```

### Usage
In `gulpfile.js`:
```js
import { src, dest } from 'gulp';
import VueSFCPlugin from '@omni-door/gulp-plugin-vue-sfc';

function compileVueSFC() {
  return src('./src/**/*.vue')
    .pipe(VueSFCPlugin())
    .pipe(dest('./dist'))
}
```

## Dev
For debugging or maintenance, you can clone the whole git repository and run the project.

```shell
git clone --depth 1 git@github.com:omni-door/gulp-plugin-vue-sfc.git

cd gulp-plugin-vue-sfc

yarn && yarn dev
```

[More Detials](./DEV.md)