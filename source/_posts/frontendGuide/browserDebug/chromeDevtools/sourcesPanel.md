---
title: Sources面板
date: 2024-06-01 10:00:52
post: comments
enable: true
categories: 
- [前端开发手册, Debug 大作战：浏览器调试全攻略]
tags: 
- [浏览器调试, 谷歌开发者工具]
---


## 概览
- Debug : 在源代码面板中可以设置**断点**来调试 JavaScript ，比 console.log()调试更快速高效
- Devtools as IDE : 通过 Workspaces（工作区）连接本地文件来使用开发者工具的**实时编辑器**

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-1.png)
## 断点类型

1. 行断点：代码运行到当前行之前暂停执行
> 在源代码添加debugger关键字或者点击Sources面板中的源代码的行号

2. 条件行断点：当满足条件时才会触发该断点
> 右击Sources面板中的源代码的行号
> 选择“Add conditional breakpoint

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-2.gif)

3. DOM 断点

    > 即Elements面板提及过的三种DOM断点：
    > - 节点属性断点
    > - 节点删除断点
    > - 子树变更断点

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-3.gif)

4. XHR/Fetch 断点
> 在页面发出XHR或Fetch请求前加断点

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-6.gif)

5. Event Listener 事件监听断点
> 可以在所有类型的事件函数被出发前加断点

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-4.png)

<!-- 6. Exception 异常断点 -->

<!-- ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-5.png) -->

6. Function 函数断点
> 把想调试的函数名作为参数，调用debug()函数，可以在每次执行该函数前暂停执行代码
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-7.gif)


## Debug

- 函数调用栈 Call Stack：Call Stack 是 time traveling 的，即点击栈中的任一节点，当前的作用域和局部变量等信息，都会模拟至该节点执行时的状态

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-8.png)

- 全局作用域 Global ，局部作用域 Local ，闭包作用域 Closure

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-9.png)

- step over next function
    > 顾名思义over有跳过的意思，即如果遇到一个函数，它会直接执行完这个函数（注意是直接执行结束返回结果），然后进入下一步，中间不显示细节。
- step into next function
   > 顾名思义into是进入的意思，即如果遇到一个函数，它不会一下运行完这个函数，而是进入函数内部，一步一步地执行，这样我们可以更清楚地观察执行过程。
- step out current function
   >  step out of current function，顾名思义out是出来的意思，即如果利用 step into已经进入了函数内部，我们可以通过此功能来一下执行完函数内部剩下的代码。
- step (与 step over/into 的区别就是，step 会优先尝试 step into，当没有可步入的代码时，就会执行 step over)

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-10.png)

<!-- - long resume：恢复执行，并将断点停用 500ms -->

<!-- ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-11.gif) -->

- Continue to here：继续执行至此行

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-12.gif)

- Restart Frame：重新执行函数调用堆栈中的某一帧

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-13.gif)

- 行断点内的多个箭头：行内断点（行内的，可 step into 的 执行点

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-14.png)

## Devtools Nodejs debug

- node 执行 js 文件，文件名前加--inspect 标志，启用浏览器 nodejs 调试

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-15.png)

- 点击 devtools 中，左上角的 devices mode 右侧的绿色按钮，即可启用 node 服务端中的脚本调试
- [更多相关](https://nodejs.org/en/docs/guides/debugging-getting-started/)

## BlackBox - ignore list
> BlackBox 的用途：“BlackBox Script”可以在调试中忽略某些脚本(此处的 BlackBox 为动词)，在 Call Stack 堆栈中会将该脚本隐藏，单步调试时也不会步入脚本中的任何函数

```javascript
    function animate() {
        prepare();
        lib.doFancyStuff(); // A
        render();
    }
```
例如以上代码的 A 行，调用的是第三方库的 doFancyStuff 函数
 
如果我确认该第三方库没有 bug
 
就可以 BlackBox 整个第三方库的 js 脚本，在调试中跳过这些代码的执行

- 三种添加 BlackBox 的方法：
1. 在源代码窗格右键，选择"BlackBox Script"

    ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-16.gif)

2. 在 Call Stack 中右键某一帧，选择"BlackBox Script"
   
   ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-17.gif)

3. 在设置中的 Blackboxing 面板添加**正则表达式**匹配**文件名**
   
   ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-18.gif)

## Workspace：Devtools as IDE 将更改持久化

- 在 sources 左侧的面板中选择Filesystem，点击Add folder to workspace，将你本地运行的站点的相关源文件添加到 Devtools 的工作区，会自动识别 Page 下和工作区下相对应的文件，在 devtools 更改文件并保存，即持久化保存（目前只支持自动识别，不支持添加映射）
- 绿标文件：成功的映射到本地的文件，在 Styles 和 Sources 中的文件名前，都会添加绿色圆点作为标识
  
  ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-19.png)

  ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-20.png)

- 目前 Devtools 已经支持 sass/scss、UglifyJS、Grunt、Coffescript、Closure 等等，暂时还不支持 webpack，和其他现代的复杂框架，如 react
- 所有sources面板的文件，都可以右键选择local modifications，查看所有更改
- 对 DOM 树的更改不会持久化至 html 文件：因为 dom 的最终表现，受到 html、css、javascript 的共同影响，DOM 树 !== HTML，因此可以在 sources 中直接更改 html 文件并保存
## Source Map

- 组合/压缩 css,js 文件是常见的性能优化方案，但是会对开发调试造成困扰
- Source Map 用于将生产代码映射至源代码，Chrome 和 firefox 都内置了对 Source Map 的支持
- 在 Chorme devtools 中，settings -> preferen -> sources 中，选中Enable Javascript source maps和Enable CSS source maps
- source map 映射信息存在 json 对象中，保存在 .map 文件中，可以由编译程序添加注释//# sourceMappingURL=/path/to/script.js.map至生产文件末尾，也可以由服务端在响应头中添加X-SourceMap: /path/to/script.js.map，将 map 文件与生产文件对应。[更多关于 source map 的介绍](https://blog.teamtreehouse.com/introduction-source-maps)

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-21.png)

## Local Overrides

- 用于覆盖网络请求: 在source/page右键save for override或直接edit，保存的文件都被存储到overrides 指定目录(按照域名建立文件夹). 这种改写是临时的
- 在 Sources 面板左侧选择 Overrides，指定 DevTools 应保存更改的目录，当在 DevTools 中进行更改时，DevTools 会将修改后的文件的副本保存到所选的本地目录中，重新加载页面时，DevTools 提供本地修改的文件，而不是请求的网络资源。
- 与 Workspace 相似的，不支持保存对 DOM 树的更改，需要直接更改 html 源文件。
- 只能指定一个目录
- 断点debug 时，实时修改文件，然后保存后会恢复到第一个断点，不用重新刷新
## Snippets 代码片段

- 在 Sources 面板左侧选择 Snippets，或crlt shift p输入 snippet 打开 Snippets 面板，可以创建并保存常用的代码片段，和用 gist 类似
- snippets 中，选中代码并ctrl enter，或点击右下角的执行按钮，即可执行代码片段

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-8-22.png)

## Content scripts

- 这部分脚本是浏览器插件的脚本，在特定网页的上下文中运行。（与插件运行在服务端的脚本，页面上引用的脚本，页面上 script 中的内嵌脚本都不同
- 插件在服务端的脚本可以访问所有 WebExtension JavaScript API，但它们无法直接访问网页内容。
- Content scripts 只能访问 WebExtension API 的一小部分，但它们可以使用消息传递系统与后台脚本进行通信，从而间接访问 WebExtension API。
- 如果有浏览器插件相关的工作，可以更深入[研究](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)，不赘述。
