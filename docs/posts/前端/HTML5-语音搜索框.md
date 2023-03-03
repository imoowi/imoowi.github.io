---
layout: default
title:  "HTML5-语音搜索框"
parent: 前端
---

# HTML5-语音搜索框

- 源码

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
<title>h5-voice-input</title>
</head>
<body class="body">
<div class="container">
	<input type="text" x-webkit-speech id="voiceInput" lang="zh-CN" x-webkit-grammar="bUIltin:search" 
onwebkitspeechchange="doSearch()" />

</div>
<script type="text/javascript">
	function doSearch() {
    var n = document.getElementById("voiceInput").value;
    if ( n === "a") {
        window.location.href = "http://www.a.com";
    } else {
        window.location.href = "https://www.b.com";
    }
}
</script>
</body>
</html>
```
- 效果
在Chrome中的效果如下:
![](/assets/images/img/voice.png)


