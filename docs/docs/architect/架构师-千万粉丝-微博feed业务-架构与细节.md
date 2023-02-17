---
layout: post
title:  "架构师-千万粉丝，微博feed业务，架构与细节"
parent: Architect
---

# 架构师-千万粉丝，微博feed业务，架构与细节
- feed类业务，特点+关键动作+核心元数据
	![](/assets/images/img/149.png)
- 最大的难点
	- 我们的主页，是由别人发布的 feed 组成的
- 获取方式
	- 拉取（读扩散）
	- 推送（写扩散）
- 核心数据结构：关注关系+粉丝关系+发布的 feed 消息
	![](/assets/images/img/150.png)

- 核心流程
	- 发布 feed
		![](/assets/images/img/151.png)
	- 取消关注
		![](/assets/images/img/152.png)
	- 拉取 feed 页
		![](/assets/images/img/153.png)
- 读扩散的优缺点
	![](/assets/images/img/154.png)
- 写扩散：被逼发展而来的模式
	- 核心数据结构：收到的 feed 消息（新增）
		![](/assets/images/img/155.png)
	- 拉取 feed 页
		![](/assets/images/img/156.png)
- feed 业务总结
	![](/assets/images/img/157.png)




<div id="gitalk-container"></div>
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script type="text/javascript">
const gitalk = new Gitalk({
  clientID: 'c8000586a21c80291476',
  clientSecret: '043d2b75bd32c8d03f65d088bbd475c563a287f4',
  repo: 'imoowi.github.io',
  owner: 'imoowi',
  admin: ['imoowi'],
  distractionFreeMode: false  
});
gitalk.render('gitalk-container')
</script>