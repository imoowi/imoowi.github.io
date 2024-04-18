---
layout: default
title:  "Docker Swarm集群管理"
parent: Docker
---
# Docker Swarm集群管理
## 1、创建swarm集群管理节点：可以是物理节点也可以是虚拟节点，此处以虚拟节点为例

```sh
#创建管理节点
$ docker-machine create -d virtualbox --virtualbox-no-vtx-check swarm-manager
#查看节点
$ docker-machine ls
NAME            ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER      ERRORS
swarm-manager   ##        virtualbox   Running   tcp://192.168.99.101:2376           v19.03.12
#进入管理节点
$ docker-machine ssh swarm-manager
#初始化管理节点
$ docker swarm init --advertise-addr 192.168.99.101 #这里的 IP 为创建机器时分配的 ip，或者是物理节点对外的公网ip。
Swarm initialized: current node (qjmrt0529lbkola5bsifjoh95) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-66r0cbyvln0ziq05pr0e6hjcuipgs26qeh9qqwb7ab8c5ds9fb-3lptd0hxu7h7n2o59czie30yi 192.168.99.101:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```
## 2、创建swarm集群工作节点（worker）
```sh
$ docker-machine create -d virtualbox --virtualbox-no-vtx-check swarm-worker1
$ docker-machine create -d virtualbox --virtualbox-no-vtx-check swarm-worker2
$ docker-machine ssh swarm-worker1
#把工作节点加入到集群
docker swarm join --token SWMTKN-1-66r0cbyvln0ziq05pr0e6hjcuipgs26qeh9qqwb7ab8c5ds9fb-3lptd0hxu7h7n2o59czie30yi 192.168.99.101:2377
This node joined a swarm as a worker.
$ docker-machine ssh swarm-worker2
docker swarm join --token SWMTKN-1-66r0cbyvln0ziq05pr0e6hjcuipgs26qeh9qqwb7ab8c5ds9fb-3lptd0hxu7h7n2o59czie30yi 192.168.99.101:2377
This node joined a swarm as a worker.
```
## 3、查看集群信息
```sh
#进入管理节点
$ docker-machine ssh swarm-manager
$ docker info
。。。
Swarm: active
  NodeID: qjmrt0529lbkola5bsifjoh95
  Is Manager: true
  ClusterID: yebdtv68qax55xkac5x41a4u8
  Managers: 1
  Nodes: 3
。。。
```
## 4、部署服务到集群中
```sh
docker@swarm-manager:~$ docker service create --replicas 1 --name helloworld alpine ping docker.com
zk8yud1zwu36cr0xr81varzkn
overall progress: 1 out of 1 tasks
1/1: running   [==================================================>]
verify: Service converged
```
## 5、查看服务部署情况
```sh
docker@swarm-manager:~$ docker service ps helloworld
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE                ERROR               PORTS
mlrs3lf7e824        helloworld.1        alpine:latest       swarm-manager       Running             Running about a minute ago
```

## 6、扩展集群服务
```sh
docker@swarm-manager:~$ docker service scale helloworld=2
helloworld scaled to 2
overall progress: 2 out of 2 tasks
1/2: running   [==================================================>]
2/2: running   [==================================================>]
verify: Service converged
docker@swarm-manager:~$ docker service ps helloworld     
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
mlrs3lf7e824        helloworld.1        alpine:latest       swarm-manager       Running             Running 3 minutes ago
ik3k940bmr0s        helloworld.2        alpine:latest       swarm-worker1       Running             Running 9 seconds ago

```
## 7、删除服务
```sh
docker@swarm-manager:~$ docker service rm helloworld
helloworld
```
## 8、滚动升级服务
```sh
#创建一个服务
docker@swarm-manager:~$ docker service create --replicas 1 --name redis --update-delay 10s redis:3.0.6                        
zkerw3p9tl0tgsonszeu4fnk1
overall progress: 1 out of 1 tasks
1/1: running   [==================================================>]
verify: Service converged
docker@swarm-manager:~$ docker service ps redis                                                       
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
ylfgkptu19ty        redis.1             redis:3.0.6         swarm-manager       Running             Running 45 seconds ago
#把服务镜像更新到新版本
docker@swarm-manager:~$ docker service update --image redis:3.0.7 redis
redis
overall progress: 1 out of 1 tasks
1/1: running   [==================================================>]
verify: Service converged
#查看服务更新信息
docker@swarm-manager:~$ docker service ps redis
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE                 ERROR               PORTS
ke91k95n18em        redis.1             redis:3.0.7         swarm-worker1       Running             Running 48 seconds ago
uyj5ztzj6q1z         \_ redis.1         redis:3.0.6         swarm-manager       Shutdown            Shutdown about a minute ago
```
## 9、查看所有服务
```sh
docker@swarm-manager:~$ docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE               PORTS
a8maf209txl6        helloworld          replicated          3/3                 alpine:latest       
zkerw3p9tl0t        redis               replicated          4/4                 redis:3.0.7
```


## 10、把服务映射到外网可访问
- 10.1、创建overlay网络
```sh
	docker@swarm-manager:~$ docker network create -d overlay imoowi
	678ysjf3juarknbaqdqqnggc8
	docker@swarm-manager:~$ docker network ls       
	NETWORK ID          NAME                DRIVER              SCOPE
	cb31aa0136c2        bridge              bridge              local
	a44c5e582ac9        docker_gwbridge     bridge              local
	a36b1b058d34        host                host                local
	678ysjf3juar        imoowi              overlay             swarm
	mvj08ngo9cjd        ingress             overlay             swarm
	cca4329c43b1        none                null                local
```
- 10.2、创建服务
```sh
	docker@swarm-manager:~$ docker service create --network imoowi --name web  -p 8080:80 --replicas 2 containous/whoami
	vw61m0fk355uz9jfcy7xiat3a
	overall progress: 2 out of 2 tasks
	1/2: running   [==================================================>]
	2/2: running   [==================================================>]
	verify: Service converged
```
- 10.3、访问服务
```sh
	simpl@yuanjun$ curl 192.168.99.102:8080
	Hostname: f60e62f0d3cf
	IP: 127.0.0.1
	IP: 10.0.0.10
	IP: 172.18.0.3
	IP: 10.0.1.3
	RemoteAddr: 10.0.0.3:54458
	GET / HTTP/1.1
	Host: 192.168.99.102:8080
	User-Agent: curl/7.79.1
	Accept: */*

	simpl@yuanjun$ curl 192.168.99.103:8080
	Hostname: f60e62f0d3cf
	IP: 127.0.0.1
	IP: 10.0.0.10
	IP: 172.18.0.3
	IP: 10.0.1.3
	RemoteAddr: 10.0.0.4:54459
	GET / HTTP/1.1
	Host: 192.168.99.103:8080
	User-Agent: curl/7.79.1
	Accept: */*

	simpl@yuanjun$ curl 192.168.99.104:8080
	Hostname: ef36f447a444
	IP: 127.0.0.1
	IP: 10.0.0.11
	IP: 172.18.0.3
	IP: 10.0.1.4
	RemoteAddr: 10.0.0.5:54460
	GET / HTTP/1.1
	Host: 192.168.99.104:8080
	User-Agent: curl/7.79.1
	Accept: */*

	simpl@yuanjun$ curl 192.168.99.104:8080
	Hostname: f60e62f0d3cf
	IP: 127.0.0.1
	IP: 10.0.0.10
	IP: 172.18.0.3
	IP: 10.0.1.3
	RemoteAddr: 10.0.0.5:54462
	GET / HTTP/1.1
	Host: 192.168.99.104:8080
	User-Agent: curl/7.79.1
	Accept: */*
	simpl@yuanjun$ curl 192.168.99.101:8080
	Hostname: ef36f447a444
	IP: 127.0.0.1
	IP: 10.0.0.11
	IP: 172.18.0.3
	IP: 10.0.1.4
	RemoteAddr: 10.0.0.2:54470
	GET / HTTP/1.1
	Host: 192.168.99.101:8080
	User-Agent: curl/7.79.1
	Accept: */*
	#综上可以看出已经实现了负载功能
```

## 11、使用Docker Stack
- 11.1 创建compose文件,例如：docker-compose.yml

```yml
#想要在 Docker Swarm 中使用类似 Docker Compose 的能力，那么你需要使用的是 Docker Stack，它的使用方式甚至是定义方式和 Docker Compose 十分类似。
#1、创建compose文件“docker-compose.yml”
version: '3'
services:
  web:
    image: my-web-app:latest
    ports:
      - "80:80"
    depends_on:
      - db
      - redis
    deploy:
      replicas: 3
      update_config:
        parallelism: 2
      restart_policy:
        condition: on-failure
  db:
    image: postgres:latest
    volumes:
      - db-data:/var/lib/postgresql/data
    deploy:
      placement:
        constraints: [node.role == manager]
  redis:
    image: redis:latest
    command: redis-server --requirepass ${DOCKER_PASSWORD}
    volumes:
      - redis-db:/data
    deploy:
      placement:
        constraints: [node.role == manager]
volumes:
  db-data:

```
- 11.2 部署堆栈

```sh
docker stack deploy -c docker-compose.yml myapp
```