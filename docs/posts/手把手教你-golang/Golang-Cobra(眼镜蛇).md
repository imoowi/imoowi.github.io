---
layout: default
title:  "Golang-Cobra(眼镜蛇)"
parent: 手把手教你-golang
---

# Golang-Cobra(眼镜蛇)

Cobra is a library providing a simple interface to create powerful modern CLI interfaces similar to git & go tools. 

Cobra是一个类似于git和go的能够提供简单界面从而创建强大的现代客户端界面的库。

- 安装
  - cobra
```go
go get -u github.com/spf13/cobra@latest
```
  - cobra-cli
```go
go install github.com/spf13/cobra-cli@latest
```
- 使用
  - 用cobra-cli初始化项目
```go
$ cd ~
$ mkdir go-cobra-project
$ cd go-cobra-project
$ go mod init go-cobra-project
$ cobra-cli init
```
项目结构如下
```go
$ tree
.
|-- cmd
|   |-- root.go
|-- go.mod
|-- go.sum
|-- main.go
```
  - 给项目添加命令
    ```go
    $ cd ~/go-cobra-project
    $ cobra-cli add server
    ```
    项目结构如下
    ```go
    $ tree
    .
    |-- cmd
    |   |-- root.go
    |   |-- server.go
    |-- go.mod
    |-- go.sum
    |-- main.go
    ```
  - 项目地址：[https://github.com/spf13/cobra-cli/blob/main/README.md](https://github.com/spf13/cobra-cli/blob/main/README.md){:target="_blank"}