---
layout: default
title:  "mysql主从(docker)"
parent: Devops
---

# mysql主从(docker)

## 创建文件夹
- 在主机创建 mysql-master-slave 文件夹
```sql
mysql-master-slave
    mysql-master
        conf.d
        db
        logs
        mysql.conf.d
    mysql-slave-1
        conf.d
        db
        logs
        mysql.conf.d
    mysql-slave-2
        conf.d
        db
        logs
        mysql.conf.d
```
- 文件配置
    - 设置 master mysqld.cnf

```bash
vim mysql-master/mysql.conf.d/mysqld.cnf
```
设置如下

```bash
# Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License, version 2.0,
# as published by the Free Software Foundation.
#
# This program is also distributed with certain software (including
# but not limited to OpenSSL) that is licensed under separate terms,
# as designated in a particular file or component or in included license
# documentation.  The authors of MySQL hereby grant you an additional
# permission to link the program and your derivative works with the
# separately licensed software that they have included with MySQL.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License, version 2.0, for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA

#
# The MySQL  Server configuration file.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html

[mysqld]
pid-file    = /var/run/mysqld/mysqld.pid
socket      = /var/run/mysqld/mysqld.sock
datadir     = /var/lib/mysql
log-error   = /var/log/mysql/error.log
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0


# 下面配置为主节点设置 
#开启二进制日志
log_bin=mysql-bin    
#为当前节点设置一个全局唯一的ID号
server_id=100
# 不需要同步数据库
binlog-ignore-db = mysql
binlog_cache_size = 1M

# 二级制自动删除的天数，默认为0，表达没有自动删除，启动时和二级制日志循环可能删除时间
expire_logs_days = 7
log_bin_trust_function_creators = 1
binlog_format=mixed

# MySQL 8.x，需要如下配置
#default_authentication_plugin=mysql_native_password
#character-set-server=utf8mb4
#collation-server=utf8mb4_unicode_ci
```
    - 设置 slave mysqld.cnf

```bash
vim mysql-slave-1/mysql.conf.d/mysqld.cnf
```

设置如下

```bash
# Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License, version 2.0,
# as published by the Free Software Foundation.
#
# This program is also distributed with certain software (including
# but not limited to OpenSSL) that is licensed under separate terms,
# as designated in a particular file or component or in included license
# documentation.  The authors of MySQL hereby grant you an additional
# permission to link the program and your derivative works with the
# separately licensed software that they have included with MySQL.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License, version 2.0, for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA

#
# The MySQL  Server configuration file.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html

[mysqld]
pid-file    = /var/run/mysqld/mysqld.pid
socket      = /var/run/mysqld/mysqld.sock
datadir     = /var/lib/mysql
log-error   = /var/log/mysql/error.log
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

server_id = 101
log-bin = mysql-bin
relay_log = relicas-mysql-relay-bin 
log-slave-updates = 1
binlog-ignore-db = mysql
log_bin_trust_function_creators = 1
binlog_format=mixed
read_only = 1

# MySQL 8.x，需要如下配置
#default_authentication_plugin=mysql_native_password
#character-set-server=utf8mb4
#collation-server=utf8mb4_unicode_ci
```

```bash
vim mysql-slave-2/mysql.conf.d/mysqld.cnf
```
设置如下

```bash
# Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License, version 2.0,
# as published by the Free Software Foundation.
#
# This program is also distributed with certain software (including
# but not limited to OpenSSL) that is licensed under separate terms,
# as designated in a particular file or component or in included license
# documentation.  The authors of MySQL hereby grant you an additional
# permission to link the program and your derivative works with the
# separately licensed software that they have included with MySQL.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License, version 2.0, for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA
#
# The MySQL  Server configuration file.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html

[mysqld]
pid-file    = /var/run/mysqld/mysqld.pid
socket      = /var/run/mysqld/mysqld.sock
datadir     = /var/lib/mysql
log-error   = /var/log/mysql/error.log
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

server_id = 102
log-bin = mysql-bin
relay_log = relicas-mysql-relay-bin 
log-slave-updates = 1
binlog-ignore-db = mysql
log_bin_trust_function_creators = 1
binlog_format=mixed
read_only = 1

# MySQL 8.x，需要如下配置
#default_authentication_plugin=mysql_native_password
#character-set-server=utf8mb4
#collation-server=utf8mb4_unicode_ci
```
- docker-compose.yml
```python
version: '3'
networks:
    imoowi:
        driver: bridge
services:
    mysql-master:
        container_name: mysql-master
        image: mysql:5.6
        ports:
            - 3308:3306
        environment:
            MYSQL_ROOT_PASSWORD: 123456
            TZ: Asia/Shanghai
        command: [
            '--character-set-server=utf8mb4',
            '--collation-server=utf8mb4_general_ci',
            '--max_connections=3000'
        ]
        volumes:
            - $PWD/mysql-master/db:/var/lib/mysql
            - $PWD/mysql-master/conf.d:/etc/mysql/conf.d
            - $PWD/mysql-master/mysql.conf.d:/etc/mysql/mysql.conf.d
            - $PWD/mysql-master/logs:/var/log/mysql
            - $PWD/mysql-master/sql:/data
        restart: always
        networks:
            - imoowi
    mysql-slave-1:
        container_name: mysql-slave-1
        image: mysql:5.6
        ports:
            - 3309:3306
        environment:
            MYSQL_ROOT_PASSWORD: 123456
            TZ: Asia/Shanghai
        command: [
            '--character-set-server=utf8mb4',
            '--collation-server=utf8mb4_general_ci',
            '--max_connections=3000'
        ]
        volumes:
            - $PWD/mysql-slave-1/db:/var/lib/mysql
            - $PWD/mysql-slave-1/conf.d:/etc/mysql/conf.d
            - $PWD/mysql-slave-1/mysql.conf.d:/etc/mysql/mysql.conf.d
            - $PWD/mysql-slave-1/logs:/var/log/mysql
            - $PWD/mysql-slave-1/sql:/data
        restart: always
        networks:
            - imoowi
    mysql-slave-2:
        container_name: mysql-slave-2
        image: mysql:5.6
        ports:
            - 3310:3306
        environment:
            MYSQL_ROOT_PASSWORD: 123456
            TZ: Asia/Shanghai
        command: [
            '--character-set-server=utf8mb4',
            '--collation-server=utf8mb4_general_ci',
            '--max_connections=3000'
        ]
        volumes:
            - $PWD/mysql-slave-2/db:/var/lib/mysql
            - $PWD/mysql-slave-2/conf.d:/etc/mysql/conf.d
            - $PWD/mysql-slave-2/mysql.conf.d:/etc/mysql/mysql.conf.d
            - $PWD/mysql-slave-2/logs:/var/log/mysql
            - $PWD/mysql-slave-2/sql:/data
        restart: always
        networks:
            - imoowi
```
- 运行容器
```bash
docker-compose up -d
```
## 设置主从同步
- 登录到 master 节点
    设置 slave 连接 master 节点
    ```sql
     mysql> grant replication client,replication slave on *.* to 'root'@'172.20.0.4';
    ```
    其中“172.20.0.2” 为 master 的 ip(通过 docker inspect mysql-master 查看)
    保存设置
    ```sql
    mysql> flush privileges;
    ```
    获取 binglog 文件名和 position
    ```sql
    mysql> show master status;
    ```
    ```sql
    +------------------+----------+--------------+------------------+-------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
    +------------------+----------+--------------+------------------+-------------------+
    | mysql-bin.000005 |      358 |              | mysql            |                   |
    +------------------+----------+--------------+------------------+-------------------+
    ```
- 登录到 slave 节点
    设置 master 地址和 pos
    ```sql
    mysql> reset master;
    mysql> CHANGE MASTER TO MASTER_HOST='mysql-master',MASTER_USER='root',MASTER_PASSWORD='123456',MASTER_PORT=3306,MASTER_LOG_FILE='mysql-bin.000005',MASTER_LOG_POS=358
    mysql> start slave

    ```
    查看同步结果
    ```sql
    mysql> show slave status\G;
    ```
    ```sql
        *************************** 1. row ***************************
                       Slave_IO_State: Waiting for master to send event
                          Master_Host: mysql-master
                          Master_User: root
                          Master_Port: 3306
                        Connect_Retry: 60
                      Master_Log_File: mysql-bin.000005
                  Read_Master_Log_Pos: 1150
                       Relay_Log_File: relicas-mysql-relay-bin.000002
                        Relay_Log_Pos: 1075
                Relay_Master_Log_File: mysql-bin.000005
                     Slave_IO_Running: Yes
                    Slave_SQL_Running: Yes
                      Replicate_Do_DB:
                  Replicate_Ignore_DB:
                   Replicate_Do_Table:
               Replicate_Ignore_Table:
              Replicate_Wild_Do_Table:
          Replicate_Wild_Ignore_Table:
                           Last_Errno: 0
                           Last_Error:
                         Skip_Counter: 0
                  Exec_Master_Log_Pos: 1150
                      Relay_Log_Space: 1256
                      Until_Condition: None
                       Until_Log_File:
                        Until_Log_Pos: 0
                   Master_SSL_Allowed: No
                   Master_SSL_CA_File:
                   Master_SSL_CA_Path:
                      Master_SSL_Cert:
                    Master_SSL_Cipher:
                       Master_SSL_Key:
                Seconds_Behind_Master: 0
        Master_SSL_Verify_Server_Cert: No
                        Last_IO_Errno: 0
                        Last_IO_Error:
                       Last_SQL_Errno: 0
                       Last_SQL_Error:
          Replicate_Ignore_Server_Ids:
                     Master_Server_Id: 100
                          Master_UUID: 9858363f-5184-11ec-866c-0242ac130002
                     Master_Info_File: /var/lib/mysql/master.info
                            SQL_Delay: 0
                  SQL_Remaining_Delay: NULL
              Slave_SQL_Running_State: Slave has read all relay log; waiting for the slave I/O thread to update it
                   Master_Retry_Count: 86400
                          Master_Bind:
              Last_IO_Error_Timestamp:
             Last_SQL_Error_Timestamp:
                       Master_SSL_Crl:
                   Master_SSL_Crlpath:
                   Retrieved_Gtid_Set:
                    Executed_Gtid_Set:
                        Auto_Position: 0
        1 row in set (0.00 sec)
    ```
    看见 Slave_IO_Running: Yes Slave_SQL_Running: Yes这两个都是Yes 说明同步已经成功了。

## 验证同步

- 连接master 节点，创建一个数据库，在新数据库下再创建一个新表。
- 再连接slave 节点可以看见再master 创建数据库下的新表，这样就表明数据已经实现同步了。    

### 附件
#### 附件均从原容器中拷贝出来
- conf.d/docker.cnf
```bash
[mysqld]
skip-host-cache
skip-name-resolve
```
- conf.d/mysql.cnf
```bash
[mysql]
```
- conf.d/mysqldmp.cnf
```bash
[mysqldump]
quick
quote-names
max_allowed_packet  = 16M
```
 
