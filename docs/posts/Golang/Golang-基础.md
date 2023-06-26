---
layout: default
title:  "Golang-2、基础"
nav_order: 2
parent: Golang
---

# Golang-2、基础
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
- 派生类型 指针类型(Pointer)、数组类型、结构化类型(struct)、Channel类型、函数类型、切片类型、接口类型(interface)、Map类型
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
  - 组成：由字母、数字、下划线组成，首字符不能为数字
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
  - 算术运算符：\+ 加 、\- 减 、\* 乘 、/ 除 、% 求余 、++ 自增 、-- 自减 
  - 关系运算符：== 相等、!= 不相等、\> 大于、< 小于、\>= 大于等于、<= 小于等于
  - 逻辑运算符：&& 逻辑与、\|\| 逻辑或、! 逻辑非
  - 位运算符：& 按位与、\| 按位或、^ 按位异或、<< 左移、\>> 右移
  - 赋值运算符：= 赋值、+= 相加后赋值、-+ 相减后赋值、*= 相乘后赋值、/= 相除后赋值、%= 求余数后赋值、<<= 左移后赋值、\>>= 右移后赋值、&= 按位与后赋值、^= 按位异或后赋值、\|= 按位或后赋值
  - 其他运算符：&identifier 返回变量地址、*Pointer 指针变量
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
  - select select 是 Go 中的一个控制结构，类似于 switch 语句。select 语句只能用于通道操作，每个 case 必须是一个通道操作，要么是发送要么是接收。select 语句会监听所有指定的通道上的操作，一旦其中一个通道准备好就会执行相应的代码块。如果多个通道都准备好，那么 select 语句会随机选择一个通道执行。如果所有通道都没有准备好，那么执行 default 块中的代码。
```go
  select {
    case <- channel1:
      fmt.Println(`通道1有数据`)
    case channelData := <- channel2:
      fmt.Println(`通道2的数据是：`, channelData)
    case channel3 <- channelDatax:
      fmt.Println(`通道3有数据进来`)
    default:
      fmt.Println(`所有通道都没有准备好`)
  }
``` 
- 循环 for

```go
  //普通循环
  for ( i:=0; i<10; i++ ) {
    fmt.Pringln(i)
  }
  //数组/切片循环
  shuzi := [5]int{1,2,3,4,5}
  for i,v := range shuzi {
    fmt.Printf("第 %d 位的值 = %d\n", i,v)
  }
  //Map循环
  cpnParamTypeMap := make(map[int]int)
  cpnParamTypeMap[10] = 10
  cpnParamTypeMap[20] = 20
  cpnParamTypeMap[30] = 30
  cpnParamTypeMap[60] = 60
  for k,v := range cpnParamTypeMap {
    fmt.Printf("CPN类型为 %d->%d", k,v)
  }

```
- 函数  函数是基本的代码块，用于执行一个任务。Go 语言最少有个 main() 函数。你可以通过函数来划分不同功能，逻辑上每个函数执行的是指定的任务。函数声明告诉了编译器函数的名称，返回类型，和参数。

```go
  // func 函数名 ([参数名 参数类型,...]) ([返回值 返回类型,...])
  func FunctionName(param1 int,param2 string,param3 interface{}) (res []string, err error) {
    // todo
    return
  }

```
- 数组 数组是具有相同唯一类型的一组已编号且长度固定的数据项序列，这种类型可以是任意的原始类型例如整型、字符串或者自定义类型。

```go
  //声明一个长度为10的int64类型的数组
  var cpnType [5]int64
  //声明一个长度为10的int64类型的数组，并初始化
  var cpnType =  [5]int64{10,15,16,24,36}
  //快速初始化
  cpnType := [5]int64{10,15,16,24,36}
```
- 指针 指针变量指向了对应值的内存地址

```go
  var imoowi string= `IMOOWI`   /* 声明实际变量 */
  var imoowiPointer *string        /* 声明指针变量 */

  imoowiPointer = &imoowi  /* 指针变量的存储地址 */

  fmt.Printf("imoowi 变量的地址是: %x\n", &imoowi  )

  /* 指针变量的存储地址 */
  fmt.Printf("imoowiPointer 变量储存的指针地址: %x\n", imoowiPointer )

  /* 使用指针访问值 */
  fmt.Printf("*imoowiPointer 变量的值: %d\n", *imoowiPointer )
```
- 结构体 结构体是由一系列具有相同类型或不同类型的数据构成的数据集合

```go
  //定义结构体
  type Cpn struct {
    Name string             `json:"name" bson:"name"`
    Type int64              `json:"type" bson:"type"`
    Devices []models.Device `json:"devices" bson:"devices"`
  }
  //访问结构体成员
  var cpn = models.Cpn
  cpn.Name = `1F-AHU`
  fmt.Println(`cpn 的名字是：`,cpn.Name)
```
- 切片 切片是对数组的抽象。可以理解为动态数组，长度是可变的。

```go
  //定义一个切片
  var cpnType []int64
  //创建一个切片
  cpnType := make([]int64,0)
  //增加切片内容
  cpnType = append(cpnType, 10)
```
- Map 是一种无序的键值对的集合

```go
  //定义一个Map
  var deviceParams []map[string]interface{}
  //创建一个Map
  deviceParams := make([]map[string]interface{})
  //取值
  dvOne := deviceParams[`2F03-A`]
  //改值
  deviceParams[`3F03-A`] = dvOne
  //取map长度
  len(deviceParams)
  //遍历map
  for k,v := range deviceParams {
    fmt.Println(`key=%s,v=%v`, k, v)
  }
```

