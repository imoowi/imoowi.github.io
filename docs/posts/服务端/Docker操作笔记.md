---
layout: default
title:  "Docker操作笔记"
parent: Docker
---

# docker操作笔记

- 拉取镜像
  
```bash
$ docker pull imoowi/php7.4:v3
```
- 运行容器

```bash
$ docker run --name php7.4 -d -p 9000:9000 -d imoowi/php7.4:v3
$ docker cp php7.4:/usr/local/etc/php-fpm.d/www.conf ./www.conf
$ docker cp php7.4:/usr/local/etc/php/php.ini-production ./php.ini
$ docker stop php7.4 
$ docker rm php7.4
$ docker run --name php7.4 \
    -d -p 9000:9000 \
    -v /data/wwwroot:/data/wwwroot \
    -v "$PWD"/www.conf:/usr/local/etc/php-fpm.d/www.conf \
    -v "$PWD"/php.ini:/usr/local/etc/php/php.ini \
    -d imoowi/php7.4:v3

```

- 打包

```bash
//docker commit -a "作者名" -m "提交信息" [你的容器ID] [容器名]
$ docker commit -a "imoowi" -m "增加了protobuf支持" 17e8d245cf57 imoowi/php7.4
$ docker images | grep php
//docker tag [镜像ID或镜像名] [dockerhub的仓库名]
$ docker tag 1ccb168e6a0d imoowi/php7.4:v3
$ docker push imoowi/php7.4:v3

```
- 导出
  
```bash
$ docker save -o nginx.tar nginx:1.19.2
```
- 导入

```bash
$ docker load -i nignx.tar
```

- 查看 
	[https://hub.docker.com/repository/docker/imoowi/php7.4](https://hub.docker.com/repository/docker/imoowi/php7.4){:target="_blank"}

### Nginx+PHP+Redis+Memcached+Mysql5.6+ssdb 
- Nginx
    [https://hub.docker.com/repository/docker/imoowi/nginx](https://hub.docker.com/repository/docker/imoowi/nginx){:target="_blank"}
- PHP7.4
    [https://hub.docker.com/repository/docker/imoowi/php7.4](https://hub.docker.com/repository/docker/imoowi/php7.4){:target="_blank"}

- Redis
	[https://hub.docker.com/repository/docker/imoowi/redis](https://hub.docker.com/repository/docker/imoowi/redis){:target="_blank"}

- Memcached
	[https://hub.docker.com/repository/docker/imoowi/memcached](https://hub.docker.com/repository/docker/imoowi/memcached){:target="_blank"}

- Mysql5.6
	[https://hub.docker.com/repository/docker/imoowi/mysql5.6](https://hub.docker.com/repository/docker/imoowi/mysql5.6){:target="_blank"}

- ssdb
	[https://hub.docker.com/repository/docker/imoowi/ssdb](https://hub.docker.com/repository/docker/imoowi/ssdb){:target="_blank"}


### docker-compose 形式运行服务

```bash
$ cd lnmp
```
- 启动服务

```bash
$ docker-compose up -d
```
- 停止服务

```bash
$ docker-compose down
```

- 重启服务

```bash
$ docker-compose restart
```

- Mac 系统 docker 路径

```bash
/Users/{YourName}/Library/Containers/com.docker.docker/Data
```
- Windows Server Docker 离线安装
	- [https://blog.csdn.net/u012869793/article/details/114288282](https://blog.csdn.net/u012869793/article/details/114288282){:target="_blank"}

  
### docker调用宿主机shell
- 普通实现

```bash
#pid设置为host，privileged设置为true，进入容器
$ docker run -it --pid=host --privileged=true ubuntu /bin/bash
#调用宿主机命令
/# nsenter -t 1 -m -u -n -i sh -c "ls /home"

```
- docker-compose实现

```bash
services:
    demo:
        image: ubuntu
        pid: host
        privileged: true
        container_name: ubuntu
        command: /bin/sh -c "nsenter -t 1 -m -u -n -i sh -c \"ls /home\""
```
- 其他记录

```bash
#更新系统资源
yum update
yum -y install htop
#创建基础目录
mkdir -p /data/config
mkdir -p /data/wwwroot
mkdir -p /data/mysql
mkdir -p /data/sh
mkdir -p /data/docker
mkdir -p /data/docker/nginx
mkdir -p /data/docker/mysql
mkdir -p /data/docker/redis
mkdir -p /data/docker/ssdb
mkdir -p /data/docker/php
#删除旧版本
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
#安装 docker 依赖                  
yum -y install  yum-utils
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
#安装 docker    
yum -y install docker-ce docker-ce-cli containerd.io
service docker start
systemctl enable docker
#设置源
touch /etc/docker/daemon.json
echo '{"registry-mirrors": ["http://hub-mirror.c.163.com"]}' > /etc/docker/daemon.json

systemctl daemon-reload
service docker restart
#安装 nginx
cd /data/docker/nginx
docker run --name nginx \
		-d -p 80:80 \
		-v /data/wwwroot:/data/wwwroot \
		-d nginx
docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf
docker cp nginx:/var/log/nginx .
docker cp nginx:/etc/nginx/conf.d .
docker stop nginx
docker rm nginx
docker run --name nginx \
		-d -p 80:80 \
		-v /data/wwwroot:/data/wwwroot \
		-v "$PWD"/nginx.conf:/etc/nginx/nginx.conf \
		-v "$PWD"/logs:/var/log/nginx \
		-v "$PWD"/conf.d:/etc/nginx/conf.d \
		-d nginx
#安装 mysql
cd /data/docker/mysql
docker run --name mysql \
		-p 3306:3306 \
		-e MYSQL_ROOT_PASSWORD=123456 \
		-d --privileged=true mysql 
docker cp mysql:/var/lib/mysql /data/mysql/data
docker stop mysql 
docker rm mysql 		
docker run --name mysql \
		-p 3306:3306 \
		-v /data/mysql/data:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD=123456 \
		-d --privileged=true mysql
#安装 php
cd /data/docker/php
docker run --name php7.4 -d -p 9000:9000 -d php:7.4-fpm 
docker cp php7.4:/usr/local/etc/php-fpm.d/www.conf ./www.conf
docker cp php7.4:/usr/local/etc/php/php.ini-production ./php.ini
docker stop php7.4 
docker rm php7.4
docker run --name php7.4 \
	-d -p 9000:9000 \
	-v /data/wwwroot:/data/wwwroot \
	-v "$PWD"/www.conf:/usr/local/etc/php-fpm.d/www.conf \
	-v "$PWD"/php.ini:/usr/local/etc/php/php.ini \
	-d php:7.4-fpm 

```
