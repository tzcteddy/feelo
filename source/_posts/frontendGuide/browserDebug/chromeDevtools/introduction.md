---
title: chrome devtools 介绍
date: 2024-06-01 10:00:59
post: comments
enable: true
categories: 
- [前端开发手册, Debug 大作战：浏览器调试全攻略]
tags: 
- [浏览器调试, 谷歌开发者工具]
---

## 从 Chrome 说起
谷歌浏览器（通常简称为 Chrome ）是由谷歌开发的网络浏览器。 它于 2008 年首次针对 Microsoft Windows 发布，后来移植到 Linux ，macOS ，iOS 和 Android 。 浏览器也是 Chrome OS 的主要组件，它可以作为 Web 应用的平台。[Chrome-wikipedia](https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FGoogle_Chrome)<br />浏览器的市场天下三分，Chorme，Safari和FireFox，从 2008 年 Chrome 横空出世以来，如今已经一家独大占据了半壁江山：<br />![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-1.png)<br />对于大部分人来说，Chrome 可能只是个浏览器，但是对于开发人员来说，它更是一个强大无比的工具，为了方便开发人员调试代码，主流的浏览器都内置了 DevTools， 所以无论你是前端还是后端，掌握 Chrome 的调试技巧意味着效率直接的提高。而接下来要介绍的，就是 Chrome-DevTools 的使用技巧。
## DevTools 简介
本段内容引用于 [Chrome DevTools](https%3A%2F%2Fdevelopers.google.com%2Fweb%2Ftools%2Fchrome-devtools%2F%23_1)说明 熟悉的同学可以跳过，也可以选择跳转到原链接访问，这里是为了给没有接触过 chrome-devtools 的同学一些基础概念。
### 打开 Chrome 开发者工具

- 在 Chrome 菜单中选择 更多工具 > 开发者工具
- 在页面元素上右键点击，选择 “检查”
- 使用 快捷键 Ctrl + Shift + I (Windows) 或 Cmd + Opt + I (Mac)
### 了解面板
我将从以下 8 个面板来讲述面板内容：

1. 元素面板
2. 控制台面板
3. 源代码面板
4. 网络面板
5. 性能面板
6. 内存面板
7. 应用面板
8. 安全面板
#### 1. 元素面板
使用元素面板可以自由的操作 DOM 和 CSS 来迭代布局和设计页面。

- 检查和调整页面
- 编辑样式
- 编辑 DOM

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-2.png)
#### 2.控制台面板
在开发期间，可以使用控制台面板记录诊断信息，或者使用它作为 shell 在页面上与 JavaScript 交互。

- 使用控制台面板
- 命令行交互

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-3.png)
#### 3.源代码面板
在源代码面板中设置断点来调试 JavaScript ，或者通过 Workspaces（工作区）连接本地文件来使用开发者工具的实时编辑器

- 断点调试
- 调试混淆的代码
- 使用开发者工具的 Workspaces（工作区）进行持久化保存

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-4.png)
#### 4.网络面板
使用网络面板了解请求和下载的资源文件并优化网页加载性能。

- 网络面板基础
- 了解资源时间轴
- 网络带宽限制

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-5.png)
#### 5.性能面板
使用时间轴面板可以通过记录和查看网站生命周期内发生的各种事件来提高页面的运行时性能。<br />![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-6.png)
#### 6.内存面板
如果需要比时间轴面板提供的更多信息，可以使用“配置”面板，例如跟踪内存泄漏。

- JavaScript CPU 分析器
- 内存堆区分析器

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-7.png)
#### 7.应用面板
使用资源面板检查加载的所有资源，包括 IndexedDB 与 Web SQL 数据库，本地和会话存储，cookie ，应用程序缓存，图像，字体和样式表。

- 管理数据

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-8.png)
#### 8.安全面板
使用安全面板调试混合内容问题，证书问题等等。

- 安全

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-9.png)


## Chrome DevTools 原理
Chrome DevTools 分为两部分，backend 和 frontend：

- backend 和 Chrome 集成，负责把 Chrome 的网页运行时状态通过调试协议暴露出来。
- frontend 是独立的，负责对接调试协议，做 UI 的展示和交互。

两者之间的调试协议叫做 Chrome DevTools Protocol，简称 CDP。
传输协议数据的方式叫做信道（message channel），有很多种，比如 Chrome DevTools 嵌入在 Chrome 里时，两者通过全局的函数通信；当 Chrome DevTools 远程调试某个目标的代码时，两者通过 WebSocket 通信。
frontend、backend、调试协议（CDP）、信道，这是 Chrome DevTools 的 4 个组成部分。
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-1-10.png)
backend 可以是 Chromium，也可以是 Node.js 或者 V8，这些 JS 的运行时都支持 Chrome DevTools Protocol。
这就是 Chrome DevTools 的调试原理。


