---
layout: default
title:  "mysql 不常用命令"
parent: Php

---

# mysql 不常用命令
- 查询数据库(databasename)中包含指定字段(zidaunming)的所有表名

```sql
SELECT table_name FROM information_schema.columns WHERE column_name='zidaunming' AND TABLE_SCHEMA = 'databasename';
```
- 添加用户并授权

```sql
create user username@'%' identified by 'PasswordStr';

grant all privileges on databasename.* to username;
grant all privileges on databasename_his_202110_202112.* to username;
grant all privileges on databasename_his_202201_202203.* to username;
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