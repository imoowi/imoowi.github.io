---
layout: default
title:  "FFMPEG视频操作常用命令"
parent: Linux

---

# FFMPEG视频操作常用命令

### 1、格式转换
- 普通转
```bash
$ ffmpeg -i input.mov -vcodec libx264 -y output.mp4
```
- 固定帧率
```bash
$ ffmpeg -i input.mov -vcodec libx264 -qscale 0 -r 24 -y output.mp4
$ ffmpeg -i input.mp4  -c:v libx264 -c:a aac output.mp4
```

### 2、旋转
- 顺时针旋转画面90度
```bash
$ ffmpeg -i test.mp4 -vf "transpose=1" out.mp4
```
- 逆时针旋转画面90度
```bash
$ ffmpeg -i test.mp4 -vf "transpose=2" out.mp4
```
- 顺时针旋转画面90度再水平翻转
```bash
$ ffmpeg -i test.mp4 -vf "transpose=3" out.mp4
```
- 逆时针旋转画面90度水平翻转
```bash
$ ffmpeg -i test.mp4 -vf "transpose=0" out.mp4
```
- 水平翻转视频画面
```bash
$ ffmpeg -i test.mp4 -vf hflip out.mp4
```
- 垂直翻转视频画面
```bash
$ ffmpeg -i test.mp4 -vf vflip out.mp4
```

### 3、生成 m3u8 文件
- 将MP4转成ts
```bash
$ ffmpeg -i Aventador.mp4 -codec copy -bsf h264_mp4toannexb Aventador.ts
```
- 将ts转成m3u8
```bash
$ ffmpeg -i Aventador.ts -c copy -map 0 -f segment -segment_list Aventador.m3u8 -segment_time 60 Aventador%06d.ts
```

### 4、缩放视频
- 改变为源视频一半大小
```bash
$ ffmpeg -i input.mpg -vf scale=iw/2:ih/2 output.mp4
```
- 改变为原视频的90%大小：
```bash
$ ffmpeg -i input.mpg -vf scale=iw*0.9:ih*0.9 output.mp4
```

### 5、合并视频
- 制作视频文件 filelist.txt，输入以下内容(已经存在的视频文件名列表):
```bash
file '1.mp4'
file '2.mp4'
file '3.mp4'
file '4.mp4'
```
- 执行命令，生成合成视频
```bash
$ ffmpeg -f concat -i filelist.txt -c copy merg.mp4
```

### 6、剪切视频
```bash
$ ffmpeg -ss 00:00:00 -t 00:13:58 -i merg.mp4 -vcodec copy -acodec copy final_f.mp4
$ ffmpeg -ss 00:17:09 -t 00:20:29 -i merg.mp4 -vcodec copy -acodec copy final_e.mp4
```

### 7、提取视频 mp3
```bash
$ ffmpeg -i input.mp4 -f mp3 -vn output.mp3	
```

### 8、图片合成视频
```bash
$ ffmpeg -f image2 -stream_loop 100 -i noAccessVideo.jpg -vcodec libx264 -b:v 200k -r 10 -s 800x600 -acodec libfaac -y 4.mp4
```

### 9、修改mp4meta信息到头部
```bash
$ qtfaststart input-540.mp4 output-540-head.mp4
```
### 10 转推流
```bash
$ ffmpeg -re -i rtmp://srs.imoowi.com:1935/live?token=d9c5aac9884f4eedbc4f/1  -vcodec copy -acodec copy -f flv  -y rtmp://srs.imoowi.com:1935/live?token=a51a3b251c6e4cdf99de/videoName
```



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
  distractionFreeMode: false,
  id: location.pathname 
});
gitalk.render('gitalk-container')
</script>