---
layout: default
title:  "Golang-工具-deadcode"
nav_order: 8
parent: 服务端
---

# Golang-工具-deadcode（查找未使用的代码）
- 1、安装deadcode

```go
go install golang.org/x/tools/cmd/deadcode@latest
```
- 2、运行 deadcode：
在项目目录下运行以下命令来分析整个项目：

```sh
jun@imoowi MINGW64 ~/dev/golang/github.com/imoowi/comer (main)
$ deadcode .
utils\format\format.go:60:6: unreachable func: Hex2Dec
utils\format\format.go:71:6: unreachable func: UniqueSliceString
utils\myfile\myfile.go:17:6: unreachable func: CreateDir
utils\myfile\myfile.go:36:6: unreachable func: RemoveDir

```

- 3、查看帮助信息：

```sh
$ deadcode -help
The deadcode command reports unreachable functions in Go programs.

Usage: deadcode [flags] package...

The deadcode command loads a Go program from source then uses Rapid
Type Analysis (RTA) to build a call graph of all the functions
reachable from the program's main function. Any functions that are not
reachable are reported as dead code, grouped by package.

Packages are expressed in the notation of 'go list' (or other
underlying build system if you are using an alternative
golang.org/x/go/packages driver). Only executable (main) packages are
considered starting points for the analysis.
...
```
- 4、分析特定包：
如果你只想分析特定的包，可以直接指定包名：

```sh
# deadcode package/name
$ deadcode github.com/imoowi/comer
utils\format\format.go:60:6: unreachable func: Hex2Dec
utils\format\format.go:71:6: unreachable func: UniqueSliceString
utils\myfile\myfile.go:17:6: unreachable func: CreateDir
utils\myfile\myfile.go:36:6: unreachable func: RemoveDir
```
- 5、包含测试代码：
使用 -test 标志来包含测试代码中的 main 函数：

```sh
# deadcode -test package/name
$ deadcode -test github.com/imoowi/comer
utils\format\format.go:60:6: unreachable func: Hex2Dec
utils\format\format.go:71:6: unreachable func: UniqueSliceString
utils\myfile\myfile.go:17:6: unreachable func: CreateDir
utils\myfile\myfile.go:36:6: unreachable func: RemoveDir
```
- 6、解释为什么函数是活跃的：
使用 -whylive 标志来解释为什么某个函数是活跃的（即被使用）：

```sh
# deadcode -whylive=package/name.function .
$ deadcode -whylive=github.com/imoowi/comer/comer.Comer.showAppTips .
                   github.com/imoowi/comer.main
  static@L0011 --> github.com/imoowi/comer/cmd.Execute
  static@L0022 --> github.com/spf13/cobra.Command.Execute
  static@L0992 --> github.com/spf13/cobra.Command.ExecuteC
  static@L1068 --> github.com/spf13/cobra.Command.execute
 dynamic@L0915 --> github.com/imoowi/comer/cmd.init$2
  static@L0021 --> github.com/imoowi/comer/comer.Comer.AddApp
  static@L0043 --> github.com/imoowi/comer/comer.Comer.showAppTips
```