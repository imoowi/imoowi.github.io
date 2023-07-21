---
layout: default
title:  "Docker里安装gitlab和runner"
parent: Docker
---

# Docker里安装gitlab和runner
## docker-compose.yml
```yml
# docker-compose.yml
version: '3.7'
services:
  gitlab-ce:
    image: 'gitlab/gitlab-ce:latest'
    restart: always
    hostname: 'localhost'
    container_name: gitlab-ce
    environment:
      GITLAB_OMNIBUS_CONFIG:
        # 公网访问ip和端口
        external_url 'http://192.168.10.126:8010'
    ports:
      # https端口
      - '10443:443'
      # ssh端口
      - '8022:22'
      # http端口
      - '8010:8010'
    volumes:
      - './gitlab/config:/etc/gitlab'
      - './gitlab/logs:/var/log/gitlab'
      - './gitlab/data:/var/opt/gitlab'
      - ./certs/client:/certs/client
    networks:
      - gitlab
  gitlab-runner:
    image: gitlab/gitlab-runner:alpine
    container_name: gitlab-runner
    restart: always
    depends_on:
      - gitlab-ce
    volumes:
      - ./certs/client:/certs/client
      - /var/run/docker.sock:/var/run/docker.sock
      - './gitlab/gitlab-runner:/etc/gitlab-runner'
      #系统管道，用于系统命令调用
      - /home/yuanjun/mypipe/monitorpipe:/yuanj/hostpipe
      - /home/yuanjun/mypipe/output.txt:/yuanj/hostoutput.txt
    networks:
      - gitlab
networks:
  gitlab:
    name: gitlab-network
```

## 修改./gitlab/config/gitlab.rb

```rb
#配置http相关
external_url 'http://192.168.10.126:8010'
nginx['redirect_http_to_https_port'] = 8010
nginx['listen_port'] = 8010

#配置ssh相关
gitlab_rails['gitlab_ssh_host'] = '192.168.10.126'
gitlab_rails['gitlab_shell_ssh_port'] = 8022

#配置邮件通知
gitlab_rails['gitlab_email_from'] = 'abc@qq.com'
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "abc@qq.com"
gitlab_rails['smtp_password'] = "abcxyz"
gitlab_rails['smtp_domain'] = "smtp.qq.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
gitlab_rails['smtp_pool'] = false
```
## 重启服务后访问
```sh
docker-compose down
docker-compose up -d
```