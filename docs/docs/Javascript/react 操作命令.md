---
layout: default
title:  "react 操作命令"
parent: Javascript
---
# react 操作命令
- 创建vite工程
```npm
npm init vite@latest app-name --template react-ts
```
```
cd app_name
yarn install
yarn dev
```
显示如下
```vite
  vite v2.9.6 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 317ms.
```


<div id="gitalk-container"></div>
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script type="text/javascript">
const gitalk = new Gitalk({
  clientID: 'c8000586a21c80291476',
  clientSecret: '043d2b75bd32c8d03f65d088bbd475c563a287f4',
  repo: 'imoowi.github.io',
  owner: 'imoowi',
  admin: ['imoowi'],
  distractionFreeMode: false  
});
gitalk.render('gitalk-container')
</script>