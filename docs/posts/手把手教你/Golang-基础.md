---
layout: default
title:  "Golang-基础"
nav_order: 2
parent: 手把手教你
---

# Golang-基础
## 部署开发环境,并运行第一个Golang项目

请访问[Golang-运行第一个Golang项目](/posts/手把手教你/Golang-第一个Golang项目/){:target="_blank"}
## 数据类型

- 布尔类型
```go
    var b bool = true
```
- 数字类型
```go
    int8 int16 int32...
```
- 字符串类型
```go
    var str string = `Golang-基础`
    var str2 string = "Golang-基础"
    str3 := `Golang-基础`
```
- 派生类型
    - 指针类型(Pointer)
```go
    var p *string
```
    - 数组类型
    - 结构化类型(struct)
    - Channel类型
    - 函数类型
    - 切片类型
    - 接口类型(interface)
    - Map类型
- 数字类型
  - 整形
    - int8 有符号 8 位整型 (-128 到 127)
    - int16 有符号 16 位整型 (-32768 到 32767)
    - int32 有符号 32 位整型 (-2147483648 到 2147483647)
    - int64 有符号 64 位整型 (-9223372036854775808 到 9223372036854775807)
    - uint8 无符号 8 位整型 (0 到 255)
    - uint16 无符号 16 位整型 (0 到 65535)
    - uint32 无符号 32 位整型 (0 到 4294967295)
    - uint64 无符号 64 位整型 (0 到 18446744073709551615)
  - 浮点型
    - float32 IEEE-754 32位浮点型数
    - float64 IEEE-754 64位浮点型数
  - 复数类型
    - complex64 32 位实数和虚数
    - complex128 64 位实数和虚数
  - 其他
    - byte 类似 uint8 
    - rune 类似 int32
    - uint 32 或 64 位
    - int 与 uint 一样大小
    - uintptr 无符号整型，用于存放一个指针
- 变量
  - 组成： Go 语言变量名由字母、数字、下划线组成，首字符不能为数字
  - 声明变量：使用var关键字
```go
    //一个变量
    var imoowi string = `IMOOWI`
    //多个变量
    var bianliang1,bianliang2 string
    var bianliang3,bianliang4 int = 6,8
    //指定变量类型，如果没有初始化，则变量默认为零值。
```
  - 声明并初始化变量
```go
    //字符串变量，初始化为“IMOOWI”
    imoowi := `IMOOWI`
```
  - 没有初始化变量的默认值
    - 数值类型（包括complex64/128）为 0
    - 布尔类型为 false
    - 字符串为 ""（空字符串）
    - 以下几种类型为 nil:
```go
    var a *int
    var a []int
    var a map[string] int
    var a chan int
    var a func(string) int
    var a error // error 是接口
``` 
- 常量
  - 常量是一个简单值的标识符，在程序运行时，不会被修改的量。常量中的数据类型只可以是布尔型、数字型（整数型、浮点型和复数）和字符串型
```go
    //定义一个温度CPN的表名
    const CPN_TEMP_TABLE string = `cpn_temp`
    //定义一个cpn类型
    const CPN_TYPE_TEMP int64 = 1024
``` 
- 运算符
  - 算术运算符：
    - \+ 加 
    - \- 减 
    - \* 乘 
    - / 除 
    - % 求余 
    - ++ 自增 
    - -- 自减 
  - 关系运算符
    - == 相等
    - != 不相等
    - \> 大于
    - < 小于
    - \>= 大于等于
    - <= 小于等于
  - 逻辑运算符
    - && 逻辑与
    - \|\| 逻辑或
    - ! 逻辑非
  - 位运算符
    - & 按位与
    - \| 按位或
    - ^ 按位异或
    - << 左移
    - \>> 右移
  - 赋值运算符
    - = 赋值
    - += 相加后赋值
    - -+ 相减后赋值
    - *= 相乘后赋值
    - /= 相除后赋值
    - %= 求余数后赋值
    - <<= 左移后赋值
    - \>>= 右移后赋值
    - &= 按位与后赋值
    - ^= 按位异或后赋值
    - \|= 按位或后赋值
  - 其他运算符
    - &identifier 返回变量地址
    - *Pointer 指针变量
- 条件
  - if
```go
    if u.Mood == `开心` {
        fmt.Println(`你很开心`)
    }
``` 
  - if...else
```go
    if u.Mood == `开心` {
        fmt.Println(`你很开心`)
    }else{
        fmt.Println(`请敞开心扉吧`)
    }
``` 
  - switch case自带break，所以在Golang中无需break，如果不想某一个case跳出，可以加上 fallthrough 
```go
    switch u.Mood {
        case `开心`:
            fallthrough
        case `很开心`:
            fmt.Println(`你很开心`)
        case `sad`:
            fmt.Println(`你比较桑`)
        default:
            fmt.Println(`你的心情好吗？`)
    }
``` 
  - select
- 循环
- 函数
- 数组
- 指针
- 结构体
- 切片
- 范围
- Map



- 参照网址
  - [https://www.runoob.com/go/go-decision-making.html](https://www.runoob.com/go/go-decision-making.html){:target="_blank"}