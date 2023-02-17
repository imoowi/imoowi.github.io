---
layout: default
title:  "新用户强制首次修改密码"
parent: Linux
---

# 新用户强制首次修改密码

- 添加用户
```bash
$ useradd yuanjun
```
- 设置用户密码
```bash
$ passwd yuanjun
```
- 强制修改密码
```bash
$ chage -d 0 yuanjun
```

- 验证
```bash
$ ssh yuanjun@server-ip
```


<div id="gitalk-container"></div>
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script src="/assets/js/md5.min.js"></script>
<script type="text/javascript">
const gitalk = new Gitalk({
  clientID: 'c8000586a21c80291476',
  clientSecret: '043d2b75bd32c8d03f65d088bbd475c563a287f4',
  repo: 'imoowi.github.io',
  owner: 'imoowi',
  admin: ['imoowi'],
  distractionFreeMode: false,
  id: md5(location.href)
});
gitalk.render('gitalk-container')
</script>