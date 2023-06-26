---
layout: default
title:  "Golang-Swagger(api文档生成器)"
parent: 手把手教你-golang
---

# Golang-Swagger(api文档生成器)
- 安装

```go
go install github.com/swaggo/swag/cmd/swag@latest
```

- 将注释添加到API源代码中，例如：

```go
//	@Summary	登录
//	@Tags		登录|退出
//	@Accept		application/json
//	@Produce	application/json
//	@Param		body	body	model.Auth	true	"用户名和密码"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/auth [post]
func Auth(c *gin.Context) {
	var userAuth model.Auth
	err := c.ShouldBindJSON(&userAuth)
	if err != nil {
		response.Error("无效的参数", http.StatusBadRequest, c)
		return
	}
	userId, ok := service.UserAuth(userAuth.Username, userAuth.Passwd)
	if !ok {
		response.Error("登录失败", http.StatusBadRequest, c)
		return
	}
	roleId := service.UserAuthRoleId(userId)
	token, _ := token.GenToken(userAuth.Username, userId, roleId)
	responseMap := make(map[string]any)
	responseMap[`token`] = token
	response.OK(responseMap, c)
}

//	@Summary	退出
//	@Tags		登录|退出
//	@Accept		application/json
//	@Produce	application/json
//	@Param		Authorization	header	string	true	"Bearer 用户令牌"
//	@Success	200
//	@Failure	400
//	@Failure	500
//	@Router		/api/logout [get]
func Logout(c *gin.Context) {
	token := c.GetString(`token`)
	if token == "" {
		response.Error("请求头中Authorization为空", http.StatusUnauthorized, c)
		return
	}
	ok := service.UserLogout(token)
	response.OK(ok, c)
}
```
- 在包含main.go文件的项目根目录运行以下命令，将会生成docs文件

```go
swag init
```
- 格式化注释(可选)

```go
swag fmt
```
- 运行程序，在浏览器输入[http://localhost:8000/swagger/index.html](http://localhost:8000/swagger/index.html){:target="_blank"}。就能看见如下API文档,如图
    ![](/assets/images/golang/swago.png)
- 项目地址：[https://github.com/swaggo/swag/blob/master/README_zh-CN.md](https://github.com/swaggo/swag/blob/master/README_zh-CN.md){:target="_blank"}