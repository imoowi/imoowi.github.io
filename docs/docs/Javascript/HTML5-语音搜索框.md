---
layout: default
title:  "HTML5-语音搜索框"
parent: Javascript
---

# HTML5-语音搜索框

![](http://simple.imoowi.com/usr/uploads/2016/11/2846090343.jpeg)

在Chrome中的效果如下:
	
![](http://simple.imoowi.com/usr/uploads/2016/11/2305393031.png)



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