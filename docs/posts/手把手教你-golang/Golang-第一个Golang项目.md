---
layout: default
title:  "Golang-运行第一个Golang项目"
nav_order: 1
parent: 手把手教你-golang
---

# Golang-运行第一个Golang项目
- 安装Golang开发环境

    访问[Golang官网(https://go.dev)](https://go.dev/dl/){:target="_blank"},
点击“Download”按钮，如图：
![](/assets/images/golang/officewebsite.png)
    下载需要的版本(以Windows为例)，如图：
![](/assets/images/golang/dl.png)
    双击刚刚下载的文件“go1.20.1.windows-amd64.msi”，一步一步安装完成即可。

- 创建项目

    在任意目录下皆可创建项目，
    ```bash
    $ cd ~/dev/golang
    $ mkdir projectName
    $ cd projectName
    $ go mod init projectName
    go: creating new go.mod: module projectName
    $ vim main.go
    ```
    输入以下内容:
    ```go
    package main
    import "fmt"
    func main(){
            fmt.Println(`hello,boy`)
    }
    ```
- 编译项目

    ```go
    $ go build .
    ```

- 运行项目
    ```go
    $ go run .
    hello,boy
    ```

