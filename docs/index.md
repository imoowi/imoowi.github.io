---
layout: default
title: Home
nav_order: 1
description: "imoowi's blog"
permalink: /
---

_Welcome to Imoowi's Blog_

Here is just the record, also u can see [_Imoowi Live System_](http://www.imoowi.com){:target="_blank"} or [Contact me](/about/)

<link rel="stylesheet" href="https://imsun.github.io/gitment/style/default.css">
<script src="https://imsun.github.io/gitment/dist/gitment.browser.js"></script>
<script type="text/javascript">
const gitment = new Gitment({
  id: 'home', 
  owner: 'imoowi',
  repo: 'https://github.com/imoowi/imoowi.github.io',
  oauth: {
    client_id: 'c8000586a21c80291476',
    client_secret: '043d2b75bd32c8d03f65d088bbd475c563a287f4',
  }
});
document.body.appendChild(gitment.render())
</script>
