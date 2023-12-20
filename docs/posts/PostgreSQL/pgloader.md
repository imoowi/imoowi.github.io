---
layout: default
title:  "PostgreSQL 转换工具 pgloader"
parent: PostgreSQL

---

# PostgreSQL 转换工具 pgloader

## MySQL 转 PostgreSQL

```sh
#执行命令
docker run --rm -it dimitri/pgloader:ccl.latest pgloader mysql://root:123456@192.168.10.47/imoowi_from pgsql://postgres:123456@192.168.10.47/imoowi_to
```

```sh
docker run --rm -it dimitri/pgloader:ccl.latest pgloader mysql://root:123456@192.168.10.47/imoowi_from pgsql://postgres:123456@192.168.10.47/imoowi_to

2023-12-20T03:26:13.002423Z LOG pgloader version "3.6.3~devel"
2023-12-20T03:26:13.943468Z LOG Migrating from #<MYSQL-CONNECTION mysql://root@192.168.10.47:3306/imoowi_from #x302001C9A0ED>
2023-12-20T03:26:13.944018Z LOG Migrating into #<PGSQL-CONNECTION pgsql://postgres@192.168.10.47:5432/imoowi_to #x302001C99BDD>
2023-12-20T03:29:21.011163Z LOG report summary reset
                             table name     errors       rows      bytes      total time
---------------------------------------  ---------  ---------  ---------  --------------
                        fetch meta data          0        133                    26.255s
                         Create Schemas          0          0                     0.015s
                       Create SQL Types          0          0                     0.011s
                          Create tables          0         62                     1.580s
                         Set Table OIDs          0         31                     0.005s
---------------------------------------  ---------  ---------  ---------  --------------
                        imoowi_to.abcss          0      47744    10.8 MB         27.402s
            imoowi_to.standard_data_sets         0      16770     2.6 MB          7.885s
                        imoowi_to.devices        0       1706   341.3 kB          4.129s
                    imoowi_to.res_labels         0        770    16.2 kB          5.594s
                        imoowi_to.cbasd          0        654    77.7 kB         11.457s
                    imoowi_to.user_logs          0        514    59.1 kB         12.215s
                imoowi_to.labels_abcde           0        460    38.3 kB         12.456s
                    imoowi_to."cbasd.old"        0        328    36.1 kB         11.881s
        imoowi_to.labels_abcde_devicetype        0         84     5.3 kB         11.490s
                        imoowi_to.pages          0         82   993.2 kB         11.568s
            imoowi_to.label_categories           0         32     2.6 kB         10.966s
        imoowi_to.config_label_components        0         24     2.7 kB         11.216s
                imoowi_to.page_templates         0         11   291.0 kB         11.259s
                    imoowi_to.projects           0         11     1.0 kB         11.165s
                    imoowi_to.abc_topo           0          8     0.4 kB         11.848s
                        imoowi_to.roles          0          2     0.1 kB         12.465s
                    imoowi_to.casbin_rule        0          0                    13.547s
                        imoowi_to.presets        0          1     0.1 kB         13.405s
                imoowi_to.preset_items           0          1     0.1 kB         14.805s
                        imoowi_to.users          0          1     0.1 kB         15.141s
                  imoowi_to.user_logs_0          0          0                    13.774s
                  imoowi_to.user_logs_1          0          0                    14.111s
                  imoowi_to.user_logs_2          0          0                    12.158s
                  imoowi_to.user_logs_3          0          0                    12.032s
                  imoowi_to.user_logs_4          0          0                    11.615s
                  imoowi_to.user_logs_5          0          0                    12.542s
                  imoowi_to.user_logs_6          0          0                    13.266s
                  imoowi_to.user_logs_7          0          0                    13.266s
                  imoowi_to.user_logs_8          0          0                    12.557s
                  imoowi_to.user_logs_9          0          0                    11.778s
                  imoowi_to.user_roles           0          1     0.1 kB          8.110s
---------------------------------------  ---------  ---------  ---------  --------------
                COPY Threads Completion          0          4                  1m38.433s
                         Create Indexes          0        102                    10.122s
                 Index Build Completion          0        102                    55.838s
                        Reset Sequences          0         31                     1.124s
                           Primary Keys          0         31                     0.399s
                    Create Foreign Keys          0          0                     0.000s
                        Create Triggers          0          0                     0.006s
                        Set Search Path          0          1                     0.016s
                       Install Comments          0        178                     2.008s
---------------------------------------  ---------  ---------  ---------  --------------
                      Total import time          ✓      69204    15.2 MB       2m47.947s
```
## 参考网址
- [https://github.com/dimitri/pgloader](https://github.com/dimitri/pgloader){:target="_blank"}
- [https://hub.docker.com/r/dimitri/pgloader](https://hub.docker.com/r/dimitri/pgloader){:target="_blank"}