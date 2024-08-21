---
layout: default
title:  "Gitlab-CI-创建Golang发布包"
parent: 其他
---

# Gitlab.CI.Release Gitlab运行CI并自动发布打包后的可执行文件包
## 配置.gitlab-ci.yml文件
```yml
cache:
  paths:
    - "./cache"
stages:
  - release
release:
  stage: release
  image: 
    name: imoowi/goreleaser:v2
    entrypoint: ['']
  variables:
    GIT_DEPTH: 0
  artifacts:
    paths:
      - dist/
    expire_in: "1 week"
  script: 
    - goreleaser release --snapshot  --clean
    - sh release.sh $CI_COMMIT_TAG
  tags:
    - runner-name
  only:
    - tags
```
## 配置.goreleaser.yaml文件
```yaml
# This is an example .goreleaser.yml file with some sensible defaults.
# Make sure to check the documentation at https://goreleaser.com

# The lines below are called `modelines`. See `:help modeline`
# Feel free to remove those if you don't want/need to use them.
# yaml-language-server: $schema=https://goreleaser.com/static/schema.json
# vim: set ts=2 sw=2 tw=0 fo=cnqoj

version: 2

before:
  hooks:
    # You may remove this if you don't use go modules.
    - go mod tidy
    # you may remove this if you don't need go generate
    - go generate ./...

builds:
  - env:
      - CGO_ENABLED=0
    goos:
       - linux
       - windows
       - darwin
    goarch:
      - amd64
      - arm
      - arm64

archives:
  - format: tar.gz
    # this name template makes the OS and Arch compatible with the results of `uname`.
    name_template: >-
      {{ .ProjectName }}_
      {{- title .Os }}_
      {{- if eq .Arch "amd64" }}x86_64
      {{- else if eq .Arch "386" }}i386
      {{- else }}{{ .Arch }}{{ end }}
      {{- if .Arm }}v{{ .Arm }}{{ end }}
    # use zip for windows archives
    format_overrides:
      - goos: windows
        format: zip

changelog:
  sort: asc
  filters:
    exclude:
      - "^docs:"
      - "^test:"
release:
  github:
    owner: ownername
    name: project_name
  name_template: "{{.ProjectName}}-v{{.Version}}"
  draft: false
  prerelease: false 
```
## 编写发布脚步 release.sh
```sh
#!/bin/bash
base_url="http://your-gitlab-domain:port"
CI_API_V4_URL="http://your-gitlab-domain:port/api/v4"
CI_PROJECT_ID=2
PRIVATE_TOKEN=hyiKzECwAydvtg8RM7h_
CI_COMMIT_TAG=$1
echo "CI_COMMIT_TAG=$CI_COMMIT_TAG"
LINKS="["
cd dist

for binary in *; do
        if [ -d "${binary}" ]; then
                # echo "${binary} 是一个文件夹"
                continue
        else
            echo "${binary} 是一个文件"
        fi
        #上传所有文件
        output=$(curl --request POST --header "PRIVATE-TOKEN:${PRIVATE_TOKEN}" --form  "file=@$binary" ${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/uploads)
        #取上传后的地址
         full_path=$(echo $output | grep -o '"full_path":"[^"]*' | cut -d '"' -f 4) 
         [ -z ${full_path} ] && exit 1 
        # echo "${binary}"
        #拼接所有链接
        LINKS="${LINKS}{ \"name\": \"${binary}\", \"url\": \"${base_url}${full_path}\",  \"link_type\":\"other\" },"
done
#截掉最后一个逗号
LINKS=${LINKS%?}
# 添加结尾的中括号
LINKS="${LINKS}]"
now=$(date +%Y%m%d%H%M) \
Data="{ \"name\": \"Release version ${CI_COMMIT_TAG}\", \"tag_name\": \"${CI_COMMIT_TAG}\", \"description\": \"Auto Deploy at ${now}\",  \"assets\": { \"links\": ${LINKS} } }"
# echo ${Data}
# 创建发布
curl --header 'Content-Type: application/json' --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" \
     --data "${Data}" \
     --request POST "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/releases"
```
## 打tag并推送
```sh
git tag -a v1.0 -m "Version 1.0 Released"
git push origin v1.0
```
