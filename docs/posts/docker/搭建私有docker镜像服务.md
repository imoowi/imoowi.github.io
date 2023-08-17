---
layout: default
title:  "搭建私有docker镜像服务"
parent: Docker
---

# 搭建私有docker镜像服务

## 拉取registry
```sh
docker pull registry:2
```

## 创建一个非认证的仓库
```sh
mkdir my-docker-registry/registry -p
cd my-docker-registry
docker run -d \
-p 5000:5000 \
--restart=always \
--name registry \
-v registry:/var/lib/registry \
registry:2
```

## 创建一个需要认证的仓库
```sh
mkdir my-docker-registry/registry -p
mkdir my-docker-registry/auth -p
cd my-docker-registry
# 创建用户名和密码
docker run \
  --entrypoint htpasswd \
  httpd:2 -Bbn testuser testpassword > auth/htpasswd

docker container stop registry
# 创建服务
docker run -d \
-p 5000:5000 \
--restart=always \
--name registry \
-v "$(pwd)"/auth:/auth \
-v "$(pwd)"/registry:/var/lib/registry \
-e "REGISTRY_AUTH=htpasswd" \
-e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
-e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
registry:2
```

## pull/push镜像
```sh
#假如私有服务器的内网ip为 172.10.10.125
#如果需要，登录服务器
docker login 172.10.10.125:5000
#拉取镜像
docker pull 172.10.10.125:5000/golang:v1
#打tag
docker tag golang 172.10.10.125:5000/golang:v2
#推送镜像
docker push 172.10.10.125:5000/golang:v2
#如果需要，退出服务器
docker logout 172.10.10.125:5000
```

## docker-compose.yml
```yml
registry:
  restart: always
  image: registry:2
  ports:
    - 5000:5000
  environment:
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
  volumes:
    - ./registry:/var/lib/registry
    - ./auth:/auth
```

## 参考网址
[https://docs.docker.com/registry](https://docs.docker.com/registry){:target="_blank"}