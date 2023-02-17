---
layout: default
title: Home
nav_order: 1
description: "imoowi's blog"
permalink: /
---

_Welcome to Imoowi's Blog_

Here is just the record, also u can see [_Imoowi Live System_](http://www.imoowi.com){:target="_blank"} or [Contact me](/about/)

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
