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