---
layout: default
title:  "Golang-微服务实战"
parent: 手把手教你
---

# Golang-微服务实战
本次微服务基于go-micro框架实现
- 安装 protoc
  - 访问url: https://github.com/protocolbuffers/protobuf/releases/，并下载相应安装包，以windows为例，下载(protoc-23.0-rc-3-win64.zip)
  - 如图
    ![](/assets/images/protoc.png)
  - 解压并加入到系统Path,如图
    ![](/assets/images/protoc_path.png)    
- 安装 protoc-gen-go
```go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```
- 安装 protoc-gen-micro
```go
go install github.com/go-micro/generator/cmd/protoc-gen-micro@latest
```
- 创建项目
```sh
cd ~/dev/golang
mkdir -p micro-demo/server
cd micro-demo/server
go mod init micro-demo
```
- 编写 protobuf文件
```sh
cd ~/dev/golang/micro-demo/server
mkdir -p proto/user
vim proto/user/user.proto
```
```go 
#~/dev/golang/micro-demo/server/proto/user/user.proto
syntax = "proto3";

package user;

service User {
  rpc Login(LoginRequest) returns (LoginResponse) {}
  }
  message LoginRequest {
    string email = 1;
    string password = 2;
  }
  message LoginResponse {
    string username = 1;
 }
option go_package = "../user";
```
- 生成代码
```sh
cd ~/dev/golang/micro-demo/server/proto/user/
protoc --proto_path=. --micro_out=. --go_out=. user.proto
$ tree ~/dev/golang/micro-demo/server/proto/
~/dev/golang/micro-demo/server/proto/
`-- user
    |-- user.pb.go
    |-- user.pb.micro.go
    `-- user.proto

1 directory, 3 files
```
- 服务端handler
```sh
mkdir -p ~/dev/golang/micro-demo/server/handler/user
vim ~/dev/golang/micro-demo/server/handler/user/user.go 
```
```go
package user

import (
	"context"
	"micro-demo/proto/user"
)

type User struct{}

func (u *User) Login(ctx context.Context, req *user.LoginRequest, rsp *user.LoginResponse) error {
	if req.Email != "imoowi@qq.com" || req.Password != "123456" {
		rsp.Username = "Sorry " + req.Email
		return nil
	}
	rsp.Username = "Welcome " + req.Email
	return nil
}
```
- 服务端main.go
```go
package main

import (
	"log"
	hUser "micro-demo/handler/user"
	pbUser "micro-demo/proto/user"
	"go-micro.dev/v4"
)

func main() {
	service := micro.NewService(micro.Name("user"))
	service.Init()
	err := pbUser.RegisterUserHandler(service.Server(), new(hUser.User))
	if err != nil {
		log.Fatal(err)
	}
	if err := service.Run(); err != nil {
		log.Fatal(err)
	}
}

```
- 运行服务
```sh
cd ~/dev/golang/micro-demo/server/
$ go run main.go
2023-05-08 16:27:56  file=server/main.go:18 level=info Starting [service] user
2023-05-08 16:27:56  file=v4@v4.10.2/service.go:99 level=info Transport [http] Listening on [::]:63836
2023-05-08 16:27:56  file=v4@v4.10.2/service.go:99 level=info Broker [http] Connected to 127.0.0.1:63837
2023-05-08 16:27:56  file=server/rpc_server.go:556 level=info Registry [mdns] Registering node: user-fce14126-574f-4417-bd09-8e3e33d4be78
```
- 测试服务
```sh
$ curl -XPOST -H 'Content-Type: application/json' -H 'Micro-Endpoint: User.Login' -d '{"email": "imoowi@qq.com"
,"password":"123456"}' http://localhost:63836
{"username":"Welcome imoowi@qq.com"}
```
- 客户端
- todo
- Go-Micro-CLI
- https://github.com/go-micro/cli