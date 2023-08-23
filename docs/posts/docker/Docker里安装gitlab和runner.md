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
        external_url 'http://172.16.10.100:8010'
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
external_url 'http://172.16.10.100:8010'
nginx['redirect_http_to_https_port'] = 8010
nginx['listen_port'] = 8010

#配置ssh相关
gitlab_rails['gitlab_ssh_host'] = '172.16.10.100'
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
## 注册runner
```sh
docker exec -it gitlab-runner sh -c 'gitlab-runner register'
Runtime platform                                    arch=amd64 os=linux pid=24 revision=bbcb5aba version=15.3.0
Running in system-mode.                            
                                                   
Enter the GitLab instance URL (for example, https://gitlab.com/):
http://172.16.10.100:4010/
Enter the registration token:
GR1348941zrk2n3Fn_s-gipF6sB_efg
Enter a description for the runner:
[627a712c5c13]: gitlab runner for imoowi
Enter tags for the runner (comma-separated):
imoowi
Enter optional maintenance note for the runner:
imoowi
Registering runner... succeeded                     runner=GR1348941zrk2n3Fns
Enter an executor: parallels, ssh, docker-ssh+machine, custom, docker-ssh, shell, virtualbox, docker+machine, kubernetes, docker:
docker
Enter the default Docker image (for example, ruby:2.7):
172.16.10.100:5000/docker:20.10.16
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
 
Configuration (with the authentication token) was saved in "/etc/gitlab-runner/config.toml" 
```

## 修改runner配置
```sh
vim /data/docker/gitlab-runner/config.toml
```
```toml
[[runners]]
  # runner的tag
  name = "imoowi"
  # 公网访问地址
  url = "http://172.16.10.100:4010/"
  id = 19
  token = "9uyHSEi1fDJR8MjsbeZx"
  token_obtained_at = 2023-08-23T09:53:18Z
  token_expires_at = 0001-01-01T00:00:00Z
  executor = "docker"
  [runners.custom_build_dir]
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
    [runners.cache.azure]
  [runners.docker]
    tls_verify = false
    image = "172.16.10.100:5000/docker:20.10.16"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    # 这里很重要，只有这里开启了，才能执行宿主机的docker
    volumes = ["/certs/client", "/cache", "/var/run/docker.sock:/var/run/docker.sock"]
    shm_size = 0
```