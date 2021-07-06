# @omni-door/gulp-plugin-vue-sfc

[English](./README.md) | 简体中文

## 快速开始

### 安装

```shell
yarn add -D @omni-door/gulp-plugin-vue-sfc
```

### 使用
在 `gulpfile.js` 中：
```js
import { src, dest } from 'gulp';
import VueSFCPlugin from '@omni-door/gulp-plugin-vue-sfc';

function compileVueSFC() {
  return src('./src/**/*.vue')
    .pipe(VueSFCPlugin())
    .pipe(dest('./dist'))
}
```

## 开发
对于调试或维护，可以将项目 clone 到本地，然后启动项目：

```shell
git clone --depth 1 git@github.com:omni-door/gulp-plugin-vue-sfc.git

cd gulp-plugin-vue-sfc

yarn && yarn dev
```

[更多详情](./DEV.zh-CN.md)