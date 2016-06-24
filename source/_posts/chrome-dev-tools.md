title: 谷歌Chrome develop tools 常用功能
date: 2015-11-14 16:28:26
tags:
---

收集一些常用的chrome调试技巧

<!-- more -->

本文依据的chrome版本为`windows 版本 46.0.2490.80 m`

## 格式化代码
现今的网站基本都是压缩多的代码，chorme可以对这些代码进行格式化:
![格式化代码](./format.gif)

## 查看元素绑定的事件
通过element的子项 Event Listeners 可以查看到选择标签上所绑定的监听事件，勾选`Ancestors`还可查看该元素父级标签所绑定的事件函数：
![Alt text](./show_event.gif)

## ajax断点

在`Sources`面板中`XHR Breakpoints`可以设置在每次ajax访问的时候自动断点，断点是根据点击`+`后输入的url规则判断的，如果没有输入内容则在所有的ajax访问时中断。

![Alt text](./ajax_event.png)

## 全局搜索
在`chorme develop tools`打开的情况下键入 `ctrl + shift + f`进行全局搜索，会搜索所有的js和css资源已查找你需要的内容，下图为根据class搜索相关代码并格式化的示例：
![Alt text](./global_search.gif)

## dom event事件自动断点中断
当dom的内容 或者dom`子标签`内容发生改变时，可以通过对element标签右键 `Break on... -> Attributes modifications`来对dom的改变打断点，`Subtree modiffications`表示该标签子标签发生dom事件时进行断点中断
![Alt text](./dom_event.png)




