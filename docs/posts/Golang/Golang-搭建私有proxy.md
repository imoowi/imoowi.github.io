---
layout: default
title:  "Golang-搭建私有proxy"
nav_order: 7
parent: Golang
---

# Golang-搭建私有proxy

## 创建服务
- 源码方式

```sh
#直接编译
git clone git@github.com:imoowi/my-go-proxy.git
cd my-go-proxy
go build .
./proxy
#docker-compose
cd my-go-proxy
docker-compose up -d --build
```
- docker方式

```sh
docker pull imoowi/my-go-proxy:v2
mkdir /data/docker/proxy

cd /data/docker/proxy

docker run --name my-go-proxy \
-d -p 8080:8080 \
-v cache:/cache \
-d imoowi/my-go-proxy:v2
```
- docker-compose

```yml
version: "3"
services:
  my-go-proxy:
    container_name: my-go-proxy
    image: imoowi/my-go-proxy:v2
    ports:
      - 8080:8080
    volumes:
      - ./cache:/cache
    restart: always
```
## 修改go环境变量
```sh
#假如私有ip为 172.10.10.125
go env -w GOPROXY="http://172.10.10.125:8080,direct"
```

## 测试
```sh
#在客户端执行
go install github.com/imoowi/comer@latest
#在服务器上可以看到
[root@localhost my-go-proxy]# ls -al ./cache/*
./cache/goproxy.cache1896295123:
total 4
drwx------  16 root root  278 Aug 16 16:02 .
drwxr-xr-x   4 root root   86 Aug 16 18:18 ..
drwxr-x--- 113 root root 4096 Aug 16 15:57 github.com

```