---
layout: default
title:  "用ElectronForge把单页面应用html打包成exe"
parent: Node
---
# 用ElectronForge把单页面应用html打包成exe
- 1、创建新应用

```sh
npm init electron-app@latest imoowi-app
√ Locating custom template: "base"
√ Initializing directory
√ Preparing template
√ Initializing template
√ Installing template dependencies
```

- 2、运行应用

```sh
cd imoowi-app
npm start

> imoowi-app@1.0.0 start
> electron-forge start

√ Checking your system
√ Locating application
√ Loading configuration
√ Preparing native dependencies [1s]
√ Running generateAssets hook
```

打开如下应用UI
![](/assets/images/electron/electron1.png)

- 3、项目结构
  
```sh
$ tree -I "node_modules"
.
|-- forge.config.js 
|-- package.json
|-- src
|   |-- index.css
|   |-- index.html
|   |-- index.js
|   `-- preload.js
`-- yarn.lock

1 directory, 7 files
```
- 4、把单页面应用编译成exe
  - 4.1、修改单页面应用的路由设置，以react为例

```tsx
//改为hash模式
const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <AllCPN />,
      },
      {
        path: 'topo',
        element: <Topo />,
      },
      {
        path: '*',
        element: <Result status={404} title="页面不存在" />,
      },
    ],
  },
])

export default router

```
  
  - 4.2、编译

```sh
pnpm build
```

  - 4.3、拷贝dist到项目下

```sh
tree -I "node_modules"
.
|-- forge.config.js
|-- package.json
|-- src
|   |-- dist
|   |   |-- assets
|   |   |   |-- index-1f9a6427.js
|   |   |   |-- index-6ecbf49c.css
|   |   |   |-- logo-4a426ec1.png
|   |   |   |-- topo-35ce09b4.svg
|   |   |   `-- topo-eede5010.js
|   |   |-- index.html
|   |   |-- icon.ico
|   |   `-- icon.png
|   |-- index.css
|   |-- index.html
|   |-- index.js
|   `-- preload.js
`-- yarn.lock

3 directories, 15 files
```
  - 4.4、修改src/index.js

```javascript
...
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "/dist/index.html"));
...
```
- 5、换图标

```tsx
//vim forge.config.js
module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./src/dist/icon.ico", //这里添加logo路径
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupIcon: "./src/dist/icon.ico",//这里添加logo路径
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};

```
```javascript
//vim src/index.js
const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: "./dist/icon.png", //这里添加logo路径
  });
```
- 6、隐藏菜单工具栏和开发者工具

```javascript
//vim src/index.js
const { Menu } = require("electron");
const Menus = [];
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: "./dist/icon.png",
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools(); //注释掉
  const mainMenu = Menu.buildFromTemplate(Menus);
  Menu.setApplicationMenu(mainMenu);
};
```
- 7、编译打包

```sh
npm run make

> imoowi-app@1.0.0 make
> electron-forge make

√ Checking your system
√ Loading configuration
√ Resolving make targets
  › Making for the following targets:
√ Running package command
  √ Preparing to package application
  √ Running packaging hooks
    √ Running generateAssets hook
    √ Running prePackage hook
  √ Packaging application
    √ Packaging for x64 on win32 [4s]
  √ Running postPackage hook
√ Running preMake hook
√ Making distributables
  √ Making a squirrel distributable for win32/x64 [49s]
√ Running postMake hook
  › Artifacts available at: C:\Users\imoowi\dev\node\imoowi-app\out\make
```
打包后如下图

![](/assets/images/electron/electron2.png)

双击运行

![](/assets/images/electron/electron3.png)
![](/assets/images/electron/electron4.png)

- 参考地址
[https://www.electronforge.io/](https://www.electronforge.io/)
- 源码
([imoowi-app.zip](/assets/attach/imoowi-app.zip){:target="_blank"})