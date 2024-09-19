---
title: 通用篇
date: 2024-06-01 10:00:58
post: comments
enable: true
categories: 
- [前端开发手册, Debug 大作战：浏览器调试全攻略]
tags: 
- [浏览器调试, 谷歌开发者工具]
---

# copying & saving
## 前言
在调试的过程中，我们总要对 Dev Tools 里面的数据进行 **复制** 或者 **保存** 的操作，所以我们来看看，关于这些，有什么小技巧呢？
## 1. copy(...)
你可以通过全局的方法 copy() 在 console 里 copy 任何你能拿到的资源，包括我们在后面会提到的那些变量。例如 copy($_) 或 copy($0)
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-1.gif)
## 2. Store as global (存储为一个全局变量)
如果你在 console 中打印了一堆数据 (例如你在 App 中计算出来的一个数组) ，然后你想对这些数据做一些额外的操作比如我们刚刚说的 copy (在不影响它原来值的情况下) 。 那就可以将它转换成一个全局变量，只需要 **右击** 它，并选择 “Store as global variable” (保存为全局变量) 选项。
第一次使用的话，它会创建一个名为 temp1 的变量，第二次创建 temp2，第三次 ... 。通过使用这些变量来操作对应的数据，不用再担心影响到他们原来的值:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-2.gif)
## 3.保存堆栈信息( Stack trace )
大多数情况下都不是一个人开发一个项目，而是一个团队协作，那么 **如何准确的描述问题，就成为了沟通的关键** ，这时候 console 打印出来的堆栈跟踪的信息对你和同事来说就起大作用了，可以省去很多沟通成本，所以你可以直接把堆栈跟踪的信息保存为一个文件，而不只是截图发给对方：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-3.gif)
## 4.直接Copy HTML
几乎所有人都知道，右击或者点击在 HTML 元素边上的省略号 (...) 就可以将它 copy 到剪贴板中
，但是你不知道的是：古老的[ctrl] + [c]大法依旧可用！
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-4.gif)

# 快捷键和通用技巧
## 前言
能直接快速提升开发效率的方式是什么？

- 掌握快捷键

这里是一些我们在日常前端开发中，相当实用的快捷键：
## 1. 切换 DevTools 窗口的展示布局
一般我在使用 DevTools 时， dock 的展示窗口都在底部 ，但是有时候我想把 dock 的窗口 切换到右边。
怎么做呢？
这时就可以通过 DevTools 的下拉菜单，或者命令菜单...或者使用一个快捷键 ctrl + shift + D (⌘ + shift + D Mac) 来实现位置的切换（通常是从 开始的位置 到 右边位置， 但是如果一开始就是 右边的位置 那么会切换到 左边的位置）:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-5.gif)
## 2. 切换 DevTools 的面板
如果可以的话，我想成为一个不需要鼠标的开发者，日常开发中，我们常需要从 元素面板 跳转到 资源面板 并返回，这样往返的来调试我们的代码，怎么来节省鼠标点击的时间呢：

- 按下 ctrl + [ 和 ctrl + ] 可以从当前面板的分别向左和向右切换面板。
- 按下 ctrl + 1 到 ``ctrl + 9可以直接转到编号1...9的面板(ctrl + 1 转到元素面板，ctrl + 4` 转到 网络信息面板等等)

**请注意!** 我们在上面介绍的第二组快捷键默认被禁用了。你可以通过 DevTools>>Settings >>Preferences>>*Appearance* 打开这个选项：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-6.gif)
## 3. 递增/递减
接下来这个技巧，对调整样式是最有用的：通过使用 带有 或者 不带有修饰键 的 上 / 下 箭头按键， 你可以实现递增和递减 0.1 ， 1 或者 10 这样数值类型的值。
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-7.png)
甚至对颜色都起作用！（虽然没什么卵用，但是真的可以起作用~）
## 4. elements， logs， sources & network 中的查找
DevTools 中的前4个主要的面板，每一个都支持 [ctrl] + [f] 快捷方式，你可以使用对应的查询方式来查找信息:

- 在 Elements 面板中 - 通过 string ，选择器 或者 XPath 来查找
- 而在 Console， Network 以及 Source 面板 - 通过区分大小写，或者可以被视为表达式的 strings， 来查找

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-8.png)
# 使用 Command
## 前言
我们直接可以直接看到的 DevTools 的功能，其实只是有限的一部分，怎么去探索更多的功能呢？
Command 菜单可以帮助我们快速找到那些被隐藏起来的功能，这也是它本身必不可少的原因。
如果你使用过 WebStorm 中的 Find Action (查找动作) 或者 Visual Studio Code 中的 Command Palette 的话，那么在 DevTools 中的 Command 菜单也与之类似：

- 在 Chrome 的调试打开的情况下 按下 [ Ctrl] + [Shift] + [P] (Mac： [⌘] + [Shift]+ [P] )
- 或者使用 DevTools 的 dropdown 按钮下的这个选项:

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-9.png)
下图中，我整理了可供选择的命令列表，归为几个部分：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-10.png)
上面这张图同时也证明了 DevTools 有多么强力!
## 1.截屏的新姿势
当你只想对一个特别的 DOM 节点进行截图时，你可能需要使用其他工具弄半天，但现在你直接选中那个节点，打开 Command 菜单并且使用 **节点截图** 的就可以了。
不只是这样，你同样可以用这种方式 **全屏截图** - 通过 Capture full size screenshot 命令。请注意，这里说的是全屏，并不是嵌入页面的一部分。一般来说这可是得使用浏览器插件才能做到的事情！
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-11.gif)
注：**节点截图有时会失效**，全屏截图暂时没有遇到问题，建议大家使用后者。
## 2.快速切换面板
DevTools 使用双面板布局，形式一般是：元素面板 + 资源面板 ，它根据屏幕可用的部分，经常将不同面板横向或者纵向的排列，以适合阅读的方式展示出来。但有时候我们并不喜欢默认的布局。
你是否想过要重置 DevTools 呢？将 样式面板 从 html预览 的底部移动到右边或者周围其他的位置呢？是的，这就是下面要介绍的 😉
打开 Commands 菜单并且输入 layout ，你会看到 2 到 3 个可供选择的项(这里不再显示你已经激活的选项)：

- 使用横向面板布局
- 使用纵向面板布局
- 使用自动面板布局

试试看：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-12.gif)
## 3.快速切换主题
经常在电脑前一坐就是一天，所以我不能忍受一直看着白闪闪的屏幕。而且突然出现的强光也让人讨厌：我们一直都在黑暗的空间中工作，突然太阳出来了，照在你的 DevTools 上，导致你什么都看不到！
这个时候 主题 就派上了用场了：在 Commands 菜单中寻找与 theme 相关的选项，实现 明亮 & 暗黑 两种主题之间的切换：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-13.gif)
# 代码块的使用
## 前言
我经常使用 JavaScript 作为我的自动化工具，来处理第三方网站和应用程序：
比方说，我想看看有多少人在我的所有媒体帖子上鼓掌。 Medium 没有提供这样的总数，所以我把这个小脚本组合在一起：
```javascript
?('td:last-child .sortableTable-number')
    .map(el => parseInt(el.innerText))
    .reduce((total, value) => total + value);
```
当我打开状态页并且输入这段脚本到 Console 面板的时候，它将会返回这个数值:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-14.png)
现在看来，即使这个脚本并没有花费我太多的精力来编写，但也只是偶尔运行一下，所以对于我来说，记住一段这样的脚本会很麻烦：
那怎么解决这个问题呢？
这就是 Snippets 的用武之地：它允许你存放 JavaScript 代码到 DevTools 中，方便你复用这些 JavaScript 代码块：
进入到 Sources 面板，在导航栏里选中 Snippets 这栏，点击 New snippet(新建一个代码块) ，然后输入你的代码之后保存，大功告成！现在你可以通过右击菜单或者快捷键： [ctrl] + [enter] 来运行它了：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-15.gif)
## 运行其他来源的代码块
当我在 DevTools 中预设了一组很棒的代码块以后，甚至都不必再通过 Sources 来运行它们。使用 Command Menu 才是最快的方式。只需在它的输入框中输入 ! ，就可以根据名字来筛选预设代码块：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-2-16.gif)



