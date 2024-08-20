---
layout: default
title:  "Mermaid学习笔记"
parent: 其他
---

# Mermaid学习笔记
Mermaid是一个基于 Javascript 的图表绘制工具

## 图表

### 节点
#### 定义：

| 表述 | 说明 |
| --- | --- |
| node[文字] | 矩形节点 |
| node(文字) | 圆角矩形节点 |
| node((文字)) | 圆形节点 |
| node>文字] | 右向旗帜状节点 |
| node{文字} | 菱形（做决定）节点 |

#### 举例
```mermaid
graph TB
    a[矩形\n节点A]
    b(圆角矩形\n节点B)
    c((圆形节点C))
    d>右向旗帜状\n节点D]
    e{"菱形(决策)\n节点E"}
    
```
![节点](/assets/images/mermaid/1.svg "节点")

### 节点连线
#### 说明

| 表述 | 说明 |
| --- | --- |
| ">" | 添加尾部箭头 |
| "-" | 不添加尾部箭头 |
| "--" | 单线(注意，这里是两个短横线) |
| "--text--" | 单线上加文字 |
| "==" | 粗线 |
| "==text==" | 粗线加文字 |
| "-.-" | 虚线 |
| "-.text.-" | 虚线加文字 |

#### 举例

```mermaid
graph TB
    %%">" : 添加尾部箭头
    a-->b
    %%"-" : 不添加尾部箭头
    c---d
    %%"--" : 单线
    e---f
    %%"-- text --" : 单线加文字
    g -- hello --> h
    %%"==" : 粗线
    i==>j
    %%"== text ==" : 粗线加文字
    k == baby ==> l
    %%"-.-" : 虚线
    m-.->n
    %%"-. text .-" : 虚线加文字
    o -. come on .-> p
```
![连线](/assets/images/mermaid/2.svg "连线")

### 图表方向
#### 定义:

| 用词 | 含义 |
| --- | --- |
| TB\|TD| 从上到下| 
| BT| 从下到上| 
| LR| 从左到右| 
| RL| 从右到左| 

#### 举例:
```mermaid
graph TD
    %%子图
    subgraph 从上到下
    %%方向
    direction TB
        a-->b
    end
    subgraph 从下到上
    direction BT
        c-->d
    end
    subgraph 从左到右
    direction LR
        e-->f
    end
    subgraph 从右到左
    direction RL
        g-->h
    end
```
![方向](/assets/images/mermaid/3.svg "方向")
### 流程图

```mermaid
flowchart LR
A[用户] -->|登录| B(系统)
B --> C{验证token}
C -->|通过| D[下一步]
C -->|不通过| E[报错]
```
![流程图](/assets/images/mermaid/4.svg "流程图")
### 时序图
```mermaid
sequenceDiagram
actor User as 用户
User->>Alice: How are you?
Alice->>John: Hello John, how are you?
loop HealthCheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
Alice-->>User: Fine
```
![时序图](/assets/images/mermaid/5.svg "时序图")

```mermaid
sequenceDiagram
  actor User as 用户
  participant Editor as 编辑器
  participant _ViewContext as @视图上下文
  participant View as 视图
  participant _EditorContext as @编辑器上下文

  Editor->>_ViewContext: 监听事件
  User->>View:<点击>
  View->>View:获取匹配对象()
  Note right of View: 对象ID
  View->>_ViewContext:处理点击(对象ID)
  _ViewContext-->>Editor:点击事件(对象ID)
  alt CTRL未按下
  Editor->>_EditorContext:设置选中集合([对象ID])
  else CTRL按下
  Editor->>_EditorContext:添加选中(对象ID)
  else 对象ID已被选中
  Editor->>_EditorContext:移除选中(对象ID)
  end
  _EditorContext->>_EditorContext:更新选中集合
  Note right of _EditorContext: 选中集合
  Note right of _EditorContext: 激活对象

```
![时序图](/assets/images/mermaid/6.svg "时序图")
### 甘特图
```mermaid
gantt
    section Section
    Completed :done,    des1, 2014-01-06,2014-01-08
    Active        :active,  des2, 2014-01-07, 3d
    Parallel 1   :         des3, after des1, 1d
    Parallel 2   :         des4, after des1, 1d
    Parallel 3   :         des5, after des3, 1d
    Parallel 4   :         des6, after des4, 1d
```
![甘特图](/assets/images/mermaid/7.svg "甘特图")
### 类图
```mermaid
classDiagram
Class01 <|-- AveryLongClass : Cool
<<Interface>> Class01
Class09 --> C2 : Where am I?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
class Class10 {
  <<service>>
  int id
  size()
}
```
![类图](/assets/images/mermaid/8.svg "类图")
### 状态图
```mermaid
stateDiagram-v2
[*] --> Still
Still --> [*]
Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
```
![状态图](/assets/images/mermaid/9.svg "状态图")
### 饼图
```mermaid
pie
"Dogs" : 386
"Cats" : 85
"Rats" : 15
```
![饼图](/assets/images/mermaid/10.svg "饼图")
## 其他
- 官网地址: [https://mermaid.js.org/](https://mermaid.js.org/){:target="_blank"}
- github地址：[https://github.com/mermaid-js/mermaid/blob/develop/README.zh-CN.md](https://github.com/mermaid-js/mermaid/blob/develop/README.zh-CN.md){:target="_blank"}