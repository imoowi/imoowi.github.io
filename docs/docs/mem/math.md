---
layout: default
title:  "不等式及其解法"
parent: Mem
---


# 第六讲 不等式及其解法

## 不等式的基本性质
- a>b,c>0 => ac > bc
- a>b,d<0 => ad < bd
- a>b,c>d => a+c > b+d
- a>b>0   =>a^n > b^n >0

## 一元一次不等式
- 一元一次不等式的解法
	- ax>b(a!=0)
		- a>0时, x> b/a
		- a<0时, x< b/a

- 一元一次不等式组的解法
	- x>1,x>3 => x>3
	- x<1,x<3 => x<1

## 一元二次不等式
- 一元二次不等式的标准形式为：
	- ax^2 + bx + c > 0 (a>0)
	- ax^2 +bc + c < 0 (a>0)
- 一元二次不等式与方程和函数的关系
	- 方程 ax^2 +bx+c=0(a>0) 有零个不等实根 x1,x2,且 x1< x2,则：
		- ax^2 +bx+c>0的解集为，x< x1 ,x>x2
		- ax^2 +bx+c<0的解集为，x1< x< x2

## 绝对值不等式
- 不等式\|x\| < a (a>0)的解集是{x\|-a<x<a}
- 不等式\|x\| > a (a>0)的解集是{x\|x>a,或x <-a}
- 不等式\|ax+b\|< c (c>0)的解集是{x\|-c< ax+b< c}(c>0)
- 不等式\|ax+b\|>c (c>0)的解集是{x\|ax+b<-c, 或者 ax+b>c}(c>0)

## 求绝对值最值
- 常规方法：分段讨论法去绝对值符号，根据图像判断最值
- 终极方法：描点看边取拐点法

## 均值不等式
- 当 x1,x2,...,xn 为 n 个正实数时，他们的算数平均值不小于它们的集合平均值，即
x1+x2+...+xn / n >= n√x1.x2...xn (xi>0,i=1,...,n)
	- (a+b)/2 >= √ab
	- (a+b+c)/3 >= 3√abc

## 例题
- 在区间(0,+00)上，函数 y=12/x^2 + 3x 的最小值是？
	拆分法，用均值不等式
	y=12/x^2 + 3x/2 + 3x/2 >= 3(3√(12/x^2 * 3x/2 * 3x/2))=9




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