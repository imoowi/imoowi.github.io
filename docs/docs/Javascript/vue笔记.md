---
layout: default
title:  "vue笔记"
parent: Javascript
---

# vue cmd
## vue2(https://cn.vuejs.org/)
``` bash
# install vue-cli
npm install --global vue-cli
# create app
vue init webpack yourapp
# install dependencies
cd yourapp
cnpm i

# serve with hot reload at localhost:8080
cnpm run dev

# build for production with minification
cnpm run build

# build for production and view the bundle analyzer report
cnpm run build --report

# run unit tests
cnpm run unit

# run e2e tests
cnpm run e2e

# run all tests
cnpm test
```
## vue3(https://v3.cn.vuejs.org/)
- 安装 vue3
```bash
# 最新稳定版
$ npm install vue@next
```
- 脚手架 Vite
```bash
npm init vite-app hello-vue3 # OR yarn create vite-app hello-vue3
```
- 脚手架 vue-cli
```bash
npm install -g @vue/cli # OR yarn global add @vue/cli
vue create hello-vue3
# select vue 3 preset

```

## vite搭建一个vue2的框架
- 01-创建一个基础的模板框架
```node
npm init vite@latest
```
-  02-安装依赖
```yarn
yarn install
yarn add vue@2.x vue-template-compiler@2.x 
```
- 用于对vue2的支持
```yarn
yarn add vite-plugin-vue2 -D
```
```json
package.json

{
  "name": "vite-item",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^2.8.0",
    "vite-plugin-vue2": "^1.9.3"
  },
  "dependencies": {
    "vue": "^2.6.14",
    "vue-template-compiler": "^2.6.14"
  }
}
```
- 03-main.js文件放入src 并修改html的引入路径

main.js

```javascript

import Vue from 'vue'
import App from './App.vue'

new Vue({
    render:h=>h(App)
}).$mount('#app')

```
index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

vite.config.js 配置

```javascript
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'
import { viteCommonjs }  from "@originjs/vite-plugin-commonjs"  

export default () =>
  defineConfig({
    build:{
      sourcemap:false
    }, 
    plugins: [createVuePlugin(),viteCommonjs()],
    resolve: {
      extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        '@': resolve('src'),
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,//自动打开浏览器
      port: 1567,//端口号
      proxy: {
        '/api': {
          target: '', //接口地址
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api'
          }
        },
      }
    },
  })
```

- 运行
```yarn
yarn dev
```