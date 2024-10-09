---
layout: default
title:  "Git操作命令"
parent: 其他
---

# Git操作命令
- 1、 配置用户名和密码
```bash
$、git config --global user.name "your name"
$ git config --global user.email "your email"
```
- 2、 创建 SSH key
```bash
$ ssh-keygen -t ed25519 -C "<comment>"
```
- 3、 复制公匙到剪切板
```bash
$ cat ~/.ssh/id_ed25519.pub | clip
```
- 4、 测试公匙
```bash
$ssh -T git@gitlab.example.com
```
- 5、 删除仓库地址
```bash
$ git remote rm origin
```
- 6、 添加仓库地址
```bash
$ git remote add origin
```
- 7、 修改仓库地址
```bash
$ git remote set-url origin git@gitlab.example.com:username/gitlab.git
```

- 8、 更新单个文件
```bash
$ git fetch
...<ignore> 554da9b..cc8990b  master     -> origin/master
$ git checkout -m cc8990b <filename>
```
- 9、 删除本地非dev的所有分支
```bash
$ git branch | grep -v dev | xargs git branch -D
Deleted branch feat/config (was 7270e09).
Deleted branch feat/doc (was a9780d5).
Deleted branch feat/energy (was bc16064).
Deleted branch feat/paradigm (was cc204ac).
Deleted branch feat/resource-control (was eb1b6dc).
Deleted branch feat/timetable (was 8b0333f).
Deleted branch feat/tpl (was 91b4a9b).
Deleted branch feat/vpn (was cd920df).
Deleted branch fix/paradigm (was 1958e4b).
# 这个命令的意思是:
# 1、列出所有分支
# 2、排除包含字符 "dev" 的行
# 3、然后将剩余的分支名作为参数传递给 'git branch -D' 命令来删除它们。
```
- $ git commit -m "x",规范，参考地址
[https://blog.csdn.net/benjaminparker/article/details/120942232?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&utm_relevant_index=1](https://blog.csdn.net/benjaminparker/article/details/120942232?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.pc_relevant_aa&utm_relevant_index=1){:target="_blank"}



