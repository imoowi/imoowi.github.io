---
layout: default
title:  "CentOS相关信息修改"
parent: Linux
---
# CentOS相关信息修改

- 1、修改主机名
	
	```bash
	# vim /etc/sysconfig/network
	HOSTNAME=[主机名]
	```
	

- 2、杀掉某个端口
	有时候关闭软件后，后台进程死掉，导致端口被占用。下面以TOMCAT端口8060被占用为例，列出详细解决过程。

	解决方法：

	- 2、1.查找被占用的端口

	```bash
	netstat -tln
	netstat -tln | grep 8060
	netstat -tln 查看端口使用情况，而netstat -tln | grep 8060则是只查看端口8060的使用情况
	```
	- 2、2.查看端口属于哪个程序？端口被哪个进程占用

	```bash
	lsof -i:8060
	COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
	java 20804 root 36u IPv6 35452317 0t0 TCP *:pcsync-https (LISTEN)
	```

	- 2、3.杀掉占用端口的进程 根据pid杀掉

	```bash
	kill -9 进程id
	kill -9 20804
	```




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