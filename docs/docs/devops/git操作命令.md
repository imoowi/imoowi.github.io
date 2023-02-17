---
layout: post
title:  "git操作命令"
parent: Devops
---

# git操作命令
- 配置用户名和密码
```bash
$ git config --global user.name "your name"
$ git config --global user.email "your email"
```
- 创建 SSH key
```bash
$ ssh-keygen -t ed25519 -C "<comment>"
```
- 复制公匙到剪切板
```bash
$ cat ~/.ssh/id_ed25519.pub | clip
```
- 测试公匙
```bash
$ssh -T git@gitlab.example.com
```
- 删除仓库地址
```bash
$ git remote rm origin
```
- 添加仓库地址
```bash
$ git remote add origin
```
- 修改仓库地址
```bash
$ git remote set-url origin git@gitlab.example.com:username/gitlab.git
```

- 更新单个文件
```bash
$ git fetch        //
...<ignore> 554da9b..cc8990b  master     -> origin/master
$ git checkout -m cc8990b <filename>
```

- $ git commit -m "x",规范

[https://blog.csdn.net/benjaminparker/article/details/120942232?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&utm_relevant_index=1](https://blog.csdn.net/benjaminparker/article/details/120942232?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&utm_relevant_index=1){:target="_blank"}




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