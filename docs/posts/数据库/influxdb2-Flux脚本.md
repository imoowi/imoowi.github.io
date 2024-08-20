---
layout: default
title:  "InfluxDB2.0 Flux脚本"
parent: 数据库

---

# influxdb2 Flux脚本

## 数据类型
```sh
bool(v: "true")
// Returns true

bool(v: 0.0)
// Returns false

bool(v: 0)
// Returns false

bool(v: uint(v: 1))
// Returns true

bytes(v: "hello")
// Returns [104 101 108 108 111]

//Duration
1ns // 1 nanosecond
1us // 1 microsecond
1ms // 1 millisecond
1s  // 1 second
1m  // 1 minute
1h  // 1 hour
1d  // 1 day
1w  // 1 week
1mo // 1 calendar month
1y  // 1 calendar year

3d12h4m25s // 3 days, 12 hours, 4 minutes, and 25 seconds

"abc" =~ /\w/
// Returns true

"z09se89" =~ /^[a-z0-9]{7}$/
// Returns true

"foo" !~ /^f/
// Returns false

"FOO" =~ /(?i)foo/
// Returns true

string(v: 42)
// Returns "42"

toTime() only operates on the _value column.

data
    |> toTime()

1.23456e+78
// Error: error @1:8-1:9: undefined identifier e

float(v: "1.23456e+78")
// Returns 1.23456e+78 (float)

int(v: "123")
// 123

int(v: true)
// Returns 1

int(v: 1d3h24m)
// Returns 98640000000000

int(v: 2021-01-01T00:00:00Z)
// Returns 1609459200000000000

int(v: 12.54)
// Returns 12

uint(v: "123")
// 123

uint(v: true)
// Returns 1

uint(v: 1d3h24m)
// Returns 98640000000000

uint(v: 2021-01-01T00:00:00Z)
// Returns 1609459200000000000

uint(v: 12.54)
// Returns 12

uint(v: -54321)
// Returns 18446744073709497295

The null type represents a missing or unknown value.

Type name: null
Null types exist in columns of other basic types. Flux does not provide a literal syntax for a null value, however, you can use debug.null() to return a null value of a specified type.
import "internal/debug"

// Return a null string
debug.null(type: "string")

// Return a null integer
debug.null(type: "int")

// Return a null boolean
debug.null(type: "bool")

Record
A record type is a set of key-value pairs. Learn how to work with record types in Flux.

{foo: "bar", baz: 123.4, quz: -2}

{"Company Name": "ACME", "Street Address": "123 Main St.", id: 1123445}
Array
An array type is an ordered sequence of values of the same type. Learn how to work with arrays in Flux.

["1st", "2nd", "3rd"]

[1.23, 4.56, 7.89]

[10, 25, -15]
Dictionary
A dictionary type is a collection of key-value pairs with keys of the same type and values of the same type. Learn how to work with dictionaries in Flux.

[0: "Sun", 1: "Mon", 2: "Tue"]

["red": "#FF0000", "green": "#00FF00", "blue": "#0000FF"]

[1.0: {stable: 12, latest: 12}, 1.1: {stable: 3, latest: 15}]
Function
A function type is a set of parameters that perform an operation. Learn how to work with functions in flux.

() => 1

(a, b) => a + b

(a, b, c=2) => { 
    d = a + b
    return d / c
}
Dynamic type syntax
Flux does not provide a literal syntax for dynamic types. To cast a value to a dynamic type:

Import the experimental/dynamic package.
Use dynamic.dynamic() to convert a value to a dynamic type.
import "experimental/dynamic"

dynamic.dynamic(v: "Example string")

// Returns dynamic(Example string)
import "experimental/dynamic"

record = {one: 1, two: 2, three: 3}
dynamicRecord = dynamic.dynamic(v: record)

dynamicRecord.one
// Returns dynamic(1)

dynamicRecord["two"]
// Returns dynamic(2)


```
## 自定义函数
```sh
//自定义函数
//函数名 = (参数) => 函数体

//1、一个参数的函数
square = (n) => n * n
square(n:3)
// Returns 9

//2、多个参数的函数
multiply = (x,y) => x*y
multiply(x: 2, y: 15)
// Returns 30
getXishu = (r,x) => {
  xishu =
    if r._time > 2024-05-26T23:00:00Z then
      0.9
    else if r._time > 2024-05-31T23:00:00Z then
      9.0
    else
      x
  return xishu
}
//3、带默认参数的函数
pow = (n, p=10) => n ^ p
pow(n: 2)
// Returns 1024

//4、转换函数（<-）
//转换是一个函数，它将流作为输入，对输入进行操作，然后输出新的流。
//管道函数的第一个参数必须写成 table=<-，它表示通过管道符输入进来的表流数据
myFn = (tables=<-,x) =>
  tables
    |> map(fn: (r)=>({ r with _value:r._value * getXishu(r,x)}))
getCoefficient = (r,x=1.0) =>{
  coefficient = 
    if r._time > 2024-05-26T23:00:00Z then
      0.9
    else if r._time > 2024-05-31T23:00:00Z then
      9.0
    else
      x
  return coefficient
}
multiplyByCoefficient = (tables=<-, coefficient=1.0) => 
  tables
    |> map(fn: (r)=>({r with _value:r._value * getCoefficient(r,coefficient)}))

a = from(bucket: "lynkros-data-server-local")
  |> range(start: -1d, stop: -1s)
  |> filter(fn: (r) => r["_measurement"] == "ly_00_ffffffff_00000205" or r["_measurement"] == "ly_00_ffffffff_00000226" or r["_measurement"] == "ly_21_ffffffff_00000205" or r["_measurement"] == "ly_21_ffffffff_00000210")
//   |> aggregateWindow(every: 1m, fn: max, createEmpty: false)
  |> aggregateWindow(every: 1m, fn: max)
//   |> difference(nonNegative: false, columns: ["_value"])
//   |> yield(name: "last")
a |> myFn(x: 0.9)


getCoefficient = (r,c) =>{
  cc = 
    if r._time > 2024-05-26T23:00:00Z then
      0.9
    else if r._time > 2024-05-31T23:00:00Z then
      9.0
    else
      c
  return cc
}
multiplyByCoefficient = (tables=<-, c=1.0) => 
  tables
    |> map(fn: (r)=>({r with _value:r._value * getCoefficient(r,c)}))

from(bucket: "lynkros-data-server-local")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "ly_00_ffffffff_00000205_day" or r["_measurement"] == "ly_00_ffffffff_00000205_hour" or r["_measurement"] == "ly_00_ffffffff_00000205_min" or r["_measurement"] == "ly_00_ffffffff_00000226_day" or r["_measurement"] == "ly_00_ffffffff_00000226_hour" or r["_measurement"] == "ly_00_ffffffff_00000226_min" or r["_measurement"] == "ly_21_ffffffff_00000205_day" or r["_measurement"] == "ly_21_ffffffff_00000205_hour" or r["_measurement"] == "ly_21_ffffffff_00000205_min" or r["_measurement"] == "ly_21_ffffffff_00000210_day" or r["_measurement"] == "ly_21_ffffffff_00000210_hour" or r["_measurement"] == "ly_21_ffffffff_00000210_min")
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  |> yield(name: "mean")
  |> multiplyByCoefficient(c:0.5)

//5、从mysql获取数据
import "sql"
sql.from(
  driverName:"mysql",
  dataSourceName:"root:123456@tcp(192.168.40.185:3306)/lynkros_builder",
  query:"SELECT * FROM user_logs_1"
)

bottom() sorts each input table by specified columns and keeps the bottom n records in each table.
columns() returns the column labels in each input table.
count() returns the number of records in each input table.
difference() returns the difference between subsequent values.
duration() converts a value to a duration type.
fill() replaces all null values in input tables with a non-null value.
data
    |> fill(value: 0.0)
Fill null values with the previous non-null value
import "sampledata"

sampledata.int(includeNull: true)
    |> fill(usePrevious: true)

increase() returns a cumulative sum of non-negative differences between rows in a table(返回表中行之间非负差异的累积总和)
median()  returns a value representing the 0.5 quantile (50th percentile) or median of input data.
aggregate.rate() returns the average rate of change (as a float) per unit for time intervals defined by every. Negative values are replaced with null.
elapsed() returns the time between subsequent records.


//过滤条件
from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(
        fn: (r) => if v.metric == "Memory" then
            r._measurement == "mem" and r._field == "used_percent"
        else if v.metric == "CPU" then
            r._measurement == "cpu" and r._field == "usage_user"
        else if v.metric == "Disk" then
            r._measurement == "disk" and r._field == "used_percent"
        else
            r._measurement != "",
    )
from(bucket: "example-bucket")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
    |> map(
        fn: (r) => ({r with
            level: if r._value >= 95.0000001 and r._value <= 100.0 then
                "critical"
            else if r._value >= 85.0000001 and r._value <= 95.0 then
                "warning"
            else if r._value >= 70.0000001 and r._value <= 85.0 then
                "high"
            else
                "normal",
        }),
    )

exists with row functions ( filter(), map(), reduce()) to check if a row includes a column or if the value for that column is null.
from(bucket: "default")
    |> range(start: -30s)
    |> map(
        fn: (r) => ({r with
            human_readable: if exists r._value then
                "${r._field} is ${string(v: r._value)}."
            else
                "${r._field} has no value.",
        }),
    )

Find unique values
This query:

Uses group() to ungroup data and return results in a single table.
Uses keep() and unique() to return unique values in the specified column.
from(bucket: "noaa")
    |> range(start: -30d)
    |> group()
    |> keep(columns: ["location"])
    |> unique(column: "location")


```
## 重要点
- 根据周采样，默认是从周四开始。如果要从周一开始表示一周的开始，可以向前偏移3天即可

```sh
//※很重要※
Downsample by calendar week starting on Monday
Flux increments weeks from the Unix epoch, which was a Thursday. Because of this, by default, all 1w windows begin on Thursday. Use the offset parameter to shift the start of weekly windows to the desired day of the week.

data
    |> aggregateWindow(every: 1w, offset: -3d, fn: mean)


```
## 数据迁移
### 导出到文件
```sh
docker exec -it influxdb /bin/bash
influxd inspect export-lp \
  --bucket-id 729e770fec99ae91 \
  --engine-path /var/lib/influxdb2/engine \
  --output-path /var/lib/influxbackup/729e770fec99ae91.lp
  --start 2020-01-01T00:00:00Z \
  --end 2024-05-31T23:59:59Z \
  --compress

```
### 从文件导入 
```sh
docker exec -it influxdb /bin/bash
influx write -b lynkros-data-server-docker -f 729e770fec99ae91.lp -o lynkros -t 1xWz94SDEI8DVu-myOM05rlaRu7uhamdIkzcw3_m-pKmeez8mnmlCoekogL0uDlH05G1HmoGhCrrihexnpmb-g== --compression gzip
```

### influxdb 2.0 window 的period是什么意思?

在InfluxDB 2.0中，`window` 是 Flux 语言中用于数据查询的一个函数，它允许用户将数据集划分为时间窗口。`period` 是 `window` 函数的一个参数，它定义了每个时间窗口的长度。这个参数对于执行时间序列分析非常重要，因为它决定了数据点是如何被聚合和分析的。

例如，如果你正在分析服务器的CPU使用率，并希望查看每5分钟的平均使用率，你可以使用 `window(every: 5m)` 来创建5分钟长度的窗口，并应用聚合函数（如 `mean()`）来计算每个窗口的平均值[^4^]。

在创建阈值检查（Threshold Check）或编辑时，"Window Period" 特性允许你定义检查评估的时间范围。这个特性对于确定在何种时间尺度上评估阈值条件是必要的[^5^]。

简而言之，`window` 的 `period` 参数在InfluxDB 2.0中用于指定时间窗口的长度，以便对时间序列数据进行分组和聚合操作。

- 正负数分别是什么意思?

在InfluxDB 2.0的Flux查询语言中，使用`window`函数时，`period`参数可以是正数或负数，它们的含义如下：

1. **正数**：当你指定一个正数作为`period`参数时，它表示向前的时间长度，即从当前时间点开始向前计算的时间窗口。例如，如果你设置`period: 5m`（5分钟），那么每个窗口将包含从查询的起始时间开始向前5分钟内的数据。

2. **负数**：当你指定一个负数作为`period`参数时，它表示向后的时间长度，即从当前时间点开始向后计算的时间窗口。例如，如果你设置`period: -5m`，那么每个窗口将包含从查询的起始时间开始向后5分钟内的数据。

在实际应用中，通常使用正数来定义窗口，因为大多数情况下我们希望分析从过去到现在的数据趋势。然而，负数窗口在某些特定场景下可能有用，比如当你需要分析特定时间点之后的数据变化时。

需要注意的是，`window`函数的`period`参数默认情况下是正数，表示从当前时间点向前的时间窗口。如果你需要分析从现在到过去的时间窗口，可以使用负数来指定。

- 向前和向后是什么意思?

在时间序列数据库和相关的数据处理中，"向前"和"向后"通常是指相对于当前时间点或查询的起始时间点的方向：

1. **向前（Forward）**：
   - 这通常指的是从当前时间点或查询的起始时间点向未来方向延伸的时间窗口。
   - 在InfluxDB 2.0的Flux查询中，如果你使用正数作为`window`函数的`period`参数，比如`period: 5m`，这意味着每个窗口将包含从查询的起始时间开始，向前延伸5分钟的数据。

2. **向后（Backward）**：
   - 这通常指的是从当前时间点或查询的起始时间点向过去方向延伸的时间窗口。
   - 在Flux查询中，如果你使用负数作为`window`函数的`period`参数，比如`period: -5m`，这意味着每个窗口将包含从查询的起始时间开始，向后延伸5分钟的数据。

例如，假设你正在查询从上午10:00到上午10:10的数据，并且你的查询起始时间点是上午10:00：

- 如果你使用`period: 5m`，向前的窗口将包括从10:00到10:05的数据。
- 如果你使用`period: -5m`，向后的窗口将包括从9:55到10:00的数据。

在实际应用中，负数的`period`参数可能不如正数参数常用，因为大多数时间序列分析关注的是从过去到现在的趋势，而不是从现在到过去的逆向分析。然而，某些特定的用例可能需要逆向分析，比如回溯特定事件的影响或进行事后分析。

## 参考地址
- 官网:https://docs.influxdata.com/influxdb/v2