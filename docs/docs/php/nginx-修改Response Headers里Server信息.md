---
layout: default
title:  "nginx-修改Response Headers里Server信息"
parent: Php
---

# nginx-修改Response Headers里Server信息

##### 为了可以显示不同与nginx的信息，我们需要重新编译源码，修改Server信息很简单，只需要修改源码包中/src/core/nginx.h里的信息。

###### 我们以 nginx1.4.2 为例

```bash
vim /usr/local/src/nginx-1.4.2/src/core/nginx.h
```
	
###### 发现里面的内容如下:

```bash
* Copyright (C) Igor Sysoev
* Copyright (C) Nginx, Inc.
*/

#ifndef _NGINX_H_INCLUDED_
#define _NGINX_H_INCLUDED_


#define nginx_version 1004002
#define NGINX_VERSION "1.4.2"
#define NGINX_VER "nginx/" NGINX_VERSION

#define NGINX_VAR "NGINX"
#define NGX_OLDPID_EXT ".oldbin"

#endif /* _NGINX_H_INCLUDED_ */
```	

###### 接下来修改 NGINX_VERSION 和 NGINX_VER 这两个常量,修改为如下：

```bash
* Copyright (C) Igor Sysoev
* Copyright (C) Nginx, Inc.
*/

#ifndef _NGINX_H_INCLUDED_
#define _NGINX_H_INCLUDED_

#define nginx_version 1004002
#define NGINX_VERSION "1.0"
#define NGINX_VER "iis9.0/" NGINX_VERSION

#define NGINX_VAR "NGINX"
#define NGX_OLDPID_EXT ".oldbin"

#endif /* _NGINX_H_INCLUDED_ */
```	

###### 这里改为iis可以进行伪装。



<div id="gitalk-container"></div>
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script src="/assets/js/md5.min.js"></script>
<script type="text/javascript">
const gitalk = new Gitalk({
  clientID: 'c8000586a21c80291476',
  clientSecret: '043d2b75bd32c8d03f65d088bbd475c563a287f4',
  repo: 'imoowi.github.io',
  owner: 'imoowi',
  admin: ['imoowi'],
  distractionFreeMode: false,
  id: md5(location.href)
});
gitalk.render('gitalk-container')
</script>