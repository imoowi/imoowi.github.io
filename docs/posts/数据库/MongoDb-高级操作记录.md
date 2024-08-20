---
layout: default
title:  "MongoDb-高级操作记录"
parent: 数据库

---

# mongodb 高级操作记录
```mongodb
> use service_monitor
> db.node_energy.find({"nodeType":1})
```
- 1、批量更新数组字段
  - 参考地址：
    - https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany
    - https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors
    - https://www.mongodb.com/docs/manual/reference/operator/update/#array
  - 例如：批量更新nodeType为1下面的devices.params.value 为 “***”，当value字段存在就更新，不存在就创建并赋值
  
    ```mongodb
    service_monitor> db.node_energy.updateMany({"nodeType":1},{$set:{"devices.$[].params.$[].value":"***"}})
    ```
- 2. 批量更新某一个数组字段
  - 参考地址：
    - https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#update-nested-arrays-in-conjunction-with----
  - 例如，批量更新devices.params.value为“-”，过滤条件是devices.params.name="湿度" 
  
    ```mongodb
    service_monitor> db.node_energy.updateMany({"devices.params.name":"湿度"},{$set:{"devices.$[].params.$[y].value":"-"}},{arrayFilters:[{"y.name":"湿度"}]})
    ```
- 3. 批量更新条件为多个数组匹配的字段
  - 参考地址：
  - 例如，批量更新devices.params.value为“-^V^-”，过滤条件是devices.params.name="温度"，匹配条件是{ name: { $in: ["N01-A","N02-A","N03-A","N04-A","N04-A"] } } 

    ```mongodb
    service_monitor> db.node_energy.updateMany({ name: { $in: ["N01-A","N02-A","N03-A","N04-A","N04-A"] } },{$set:{"devices.$[].params.$[y].value":"-^V^-"}},{arrayFilters:[{"y.name":"温度"}]})
    ```
```mongodb
db.standard_data_set.updateMany({"unit":"无"},{$set:{"unit":""}});
db.standard_data_set.updateMany({"unit":"m2"},{$set:{"unit":"㎡"}});
db.standard_data_set.updateMany({"unit":"m3"},{$set:{"unit":"m³"}});
db.standard_data_set.updateMany({"unit":"oC"},{$set:{"unit":"℃"}});
db.standard_data_set.updateMany({"unit":"m3/h"},{$set:{"unit":"m³/h"}});
db.standard_data_set.updateMany({"unit":"m3/s"},{$set:{"unit":"m³/s"}});
db.standard_data_set.updateMany({"unit":"￥/m3"},{$set:{"unit":"￥/m³"}});
db.standard_data_set.updateMany({"unit":"￥/(m2.天)"},{$set:{"unit":"￥/(㎡.天)"}});
db.standard_data_set.updateMany({"unit":"μg/m3"},{$set:{"unit":"μg/m³"}});
db.standard_data_set.updateMany({"unit":"mH2O"},{$set:{"unit":"mH₂O"}});
db.standard_data_set.updateMany({"unit":"kwh"},{$set:{"unit":"kWh"}});
db.standard_data_set.updateMany({"unit":"kw"},{$set:{"unit":"kW"}});
db.standard_data_set.updateMany({"type":"16"},{$set:{"type":16}});
db.standard_data_set.updateMany({"data_format":"无符号整理"},{$set:{"data_format":"无符号整形"}});
db.standard_data_set.updateMany({"data_format":"0"},{$set:{"data_format":"无符号整形"}});
```

- service_monitor集合说明
  - node_instance node_设备集合
  - floor 楼层集合
  - 
- 操作记录

```mongodb

db.node_instance.updateMany({"nodeType":"2"},{$set:{"devices.$[].params.$[x].name":"xx开关"}},{arrayFilters:[{"x.name":"xx报警"}]})
db.node_instance.updateMany({"nodeType":"2"},{$set:{"devices.$[].params.$[x].name":"yyy压差开关"}},{arrayFilters:[{"x.name":"yyy报警"}]})

db.node_instance.updateMany({"nodeType":"2"},{$set:{"devices.$[].params.$[x].name":"zzz压差开关"}},{arrayFilters:[{"x.name":"zzz报警"}]})

db.node_instance.updateMany({"nodeType":"2"},{$set:{"devices.$[].params.$[x].name":"aaa报警"}},{arrayFilters:[{"x.name":"bb提示"}]})

db.node_instance.updateMany({},{$set:{"devices.$[].params.$[].value":""}})
```

- 副本集备份与恢复
  - 备份 mongodump -h 'rs/server-ip:27011,server-ip:27012,server-ip:27013' -u 'user' -p 'password' --oplog --gzip -o /file/path/to/service_monitor --authenticationDatabase admin
  - 恢复 mongorestore -h 'rs/127.0.0.1:27011,127.0.0.1:27012,127.0.0.1:27013' -u 'user' -p 'password' --oplogReplay --gzip /file/path/to/service_monitor

- standalone备份与恢复
  - 备份 mongodump --uri='mongodb://user:password@server-ip:27017/?authSource=admin' -d service_monitor_prod -o service_monitor_prod
  - 恢复 mongorestore.exe --uri='mongodb://user:password@localhost:27017/?authSource=admin' -d service_monitor_prod service_monitor_prod
  
  - 备份单表 mongodump --uri='mongodb://user:password@server-ip:27017/?authSource=admin' -d service_monitor -c video_list -o video_list
  - 恢复单表 mongorestore.exe --uri='mongodb://user:password@localhost:27017/?authSource=admin' -d service_monitor -c historyData service_monitor_p
rod

```mongodb
mongodump.exe --uri='mongodb://user:password@server-ip:4008/?authSource=admin' -d service_monitor -c video_list -o video_list

mongorestore.exe --uri='mongodb://user:password@server-ip:27017/?authSource=admin' -d service_monitor -c video_list video_list/video_list.bson
```
