---
layout: default
title:  "cp 命令强制覆盖步骤"
parent: linux
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