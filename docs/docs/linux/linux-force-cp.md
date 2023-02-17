---
layout: default
title:  "cp 命令强制覆盖步骤"
parent: Linux
---

# cp 命令强制覆盖步骤
- 取消别名
```bash
$ unalias cp
```
- 强制覆盖
```bash
$ cp -rf from to
```
- 恢复别名
```bash
$ alias cp='cp -i'
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
  distractionFreeMode: false,
  id: location.pathname   
});
gitalk.render('gitalk-container')
</script>