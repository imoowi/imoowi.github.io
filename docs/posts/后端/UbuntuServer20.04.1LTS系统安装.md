---
layout: default
title:  "Ubuntu Server 20.04.1 LTS系统安装"
parent: 后端
---

# Ubuntu Server 20.04.1 LTS系统安装
- 下载系统镜像
	[https://releases.ubuntu.com/22.04/ubuntu-22.04.1-live-server-amd64.iso](https://releases.ubuntu.com/22.04/ubuntu-22.04.1-live-server-amd64.iso){:target="_blank"}

- 制作U盘启动
	- UltraISO工具制作启动盘
	- 刻录到U盘
	- 参考地址 [https://blog.csdn.net/cheneykl/article/details/79111278](https://blog.csdn.net/cheneykl/article/details/79111278){:target="_blank"}


- 安装系统
	- 换源
	```sh
	$ sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
	$ vim sources.list
	#替换源地址
	/:%s/http:\/\/cn\.archive\.ubuntu\.com/http:\/\/mirrors\.tuna\.tsinghua\.edu\.cn/g
	#退出保存，更新源
	$ sudo apt-get update
	$ sudo apt-get upgrade
	```
	- 修改root密码
	```sh
	$ sudo passwd root #启用root账号并设置密码，根据提示输入2次密码
	$ su - root #从普通用户切换到root用户，根据提示输入root密码
	$ sudo passwd -l root #禁用root账号，如果要启用，输入sudo passwd root再次设置root密码
	```
	- 设置IP地址、网关、NDS
	```sh
	$ vim /etc/netplan/00-installer-config.yaml
	# 输入以下内容
	# This is the network config written by 'subiquity'
	network:
	  ethernets:
	    enp3s0:
	      dhcp4: no
	      addresses: [192.168.0.3/24] #这里是IP地址
	      gateway4: 192.168.0.1 #这里是网关地址
	      nameservers: #这里是DNS地址
	        addresses: [8.8.8.8]
	        addresses: [8.8.4.4]
	  version: 2
	#保存退出
	netplan apply # 使配置生效
	```
	- 修改主机名
	```sh
	$ vim /etc/hostname
	```
	- 更改ssh 默认端口号
	```sh
	$ vim /etc/ssh/sshd_config
	#将Port 22 替换为
	Port 4022
	#重启sshd
	$ /etc/init.d/ssh restart sshd
	```
	- 禁用root 远程登录
	```sh
	$ vim /etc/ssh/sshd_config
	```
	将
	```sh
	#PermitRootLogin prohibit-password
	```
	替换为
	```sh
	PermitRootLogin no
	```
	并重启 sshd 服务
	```sh
	#重启sshd
	$ /etc/init.d/ssh restart sshd
	```
	远程连接
	```sh
	$ ssh -p 4022 username@your-server-ip
	```
	- 禁止密码登录
	```sh
	$ sudo vim /etc/ssh/sshd_config
	#PasswordAuthentication yes
	PasswordAuthentication no
	```
- openvpn
	- todo
- vsftpd
	- 添加虚拟用户

```sh
$ cp /data/vsftpd/ftp /data/vsftpd/vconf/{username}
$ echo "{username}" >> /data/vsftpd/virtusers
$ echo "{passwd}" >> /data/vsftpd/virtusers
$ db_load -T -t hash -f /data/vsftpd/virtusers /data/vsftpd/virtusers.db
```
- 参考网址：
  - [https://www.cnblogs.com/alisapine/p/15908070.html](https://www.cnblogs.com/alisapine/p/15908070.html){:target="_blank"}
  - [http://t.zoukankan.com/muahao-p-6290813.html](http://t.zoukankan.com/muahao-p-6290813.html){:target="_blank"}


