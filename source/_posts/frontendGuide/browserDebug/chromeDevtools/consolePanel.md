---
title: Console 面板
date: 2024-06-01 10:00:56
post: comments
enable: true
categories: 
- [前端开发手册, Debug 大作战：浏览器调试全攻略]
tags: 
- [浏览器调试, 谷歌开发者工具]
---


# console 中的 '$'
## 前言
$ 作为 jQuery 的选择器，承载了一代前端的太多记忆，但是你可能没有想到的是，在我们使用 Dev Tools 进行调试的时候，$ 也有大放异彩的一天呢？
## 1. $0
在 Chrome 的 Elements 面板中， $0 是对我们当前选中的 html 节点的引用。
理所当然，$1 是对上一次我们选择的节点的引用，$2 是对在那之前选择的节点的引用，等等。一直到 $4
你可以尝试一些相关操作(例如: $1.appendChild($0))
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-1.awebp)
<!-- ## 1. $ 和 ?
如果你没有在 App 中定义过 $ 变量 (例如 jQuery )的话，它在 console 中就是对这一大串函数 document.querySelector 的别名。
如果是 ? 就更加厉害了，还能节省更多的时间，因为它不仅执行 document.QuearySelectorAll 并且它返回的是：一个节点的 **数组** ，而不是一个 Node list
本质上来说 Array.from(document.querySelectorAll('div')) === ?('div') ，但是document.querySelectorAll('div') 和 ?('div') 哪一种方式更加优雅呢？ -->
## 2. $_
调试的过程中，你经常会通过打印查看一些变量的值，但如果你想看一下上次执行的结果呢？再输一遍表达式吗？
这时候 $_ 就派上了用场，$_ 是对上次执行的结果的 **引用** ：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-2.awebp)
## 3. $i
现在的前端开发过程，离不开各种 npm 插件，但你可能没有想过，有一天我们竟然可以在 Dev Tools 里面来使用 npm 插件！
有时你只是想玩玩新出的 npm 包，现在不用再大费周章去建一个项目测试了，只需要在 [Chrome插件:Console Importer](https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fconsole-importer%2Fhgajpakhafplebkdljleajgbpdmplhie%2Frelated) 的帮助之下，快速的在 console 中引入和测试一些 npm 库。
运行 $i('lodash') 或者 $i('moment') 几秒钟后，你就可以获取到 lodash / momentjs 了:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-3.awebp)
# console.log 的 "bug" ?
一般来说，我们会使用 console.log() 来打印某个对象，并且，两次打印之间，还会对这个对象进行修改，最后我们查看打印的结果发现，修改前的打印和修改后的打印，竟然是一样的？这样出乎意料的情况，让我们难以继续 console.log 的调试。
口说无凭，举个例子把：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-4.awebp)
我们可以看到，一共有两次打印，一次是打印原始信息，一次是打印我们修改后的信息，并且我们把属性 a 从 0 改成 1 ，name 属性从 Tomek 改成 Not Tomek
但打印的时候，两次都是我们修改之后的值？
那，为什么会出现这一现象？
说明：
console 中打印出的对象，在你打印出他内容之前，是以引用的方式保存的。
知道了原因，对应的就知道该怎么处理这样的情况了：

- 打印一个从这个对象复制出来的对象。
- 使用资源面中的断点来调试
- 使用 JSON.stringify() 方法处理打印的结果
- 更多你可以想到的好方法~
# 异步的 console
如今，越来越多与浏览器有关的 API 都是 _基于 Promise 的_ 。当你使用 promise 的时候通常配套用 .then(处理方法) 或者 将 promise 包裹在 async 方法中，再使用 await 来接收结果。
我们在 JavaScript/TypeScript 中大量使用的东西，但如果在 Console 中书写这样的结构很不方便。
像下面这样
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-5.awebp)
或者这样
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-6.awebp)
这样太难用了！不是输入之前就被触发了，就是括号漏写了...
**但如果 console 默认就被 async 包裹呢？**
你猜怎么着，还真是这样！你可以直接使用 await ：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-7.awebp)
事实上,在 Console 中使用 promise 比在源码中使用起来还要简单！
## 1. 用你的异步console 来看一些更酷的东西
我和你一样，觉得 fetch 的例子相当无聊 -- 所以再来一个新玩法：通过 console 来获取到更多有意思的信息。

- Storage 系统的 **占用数** 和 **空闲数**
```
await navigator.storage.estimate()
```
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-8.awebp)

- 设备的 **电池信息**

为了达到更好的效果，我们将这个技巧和前几天中提到的 console.table 来合并使用：
敲黑板：这是一条[不推荐使用的API](https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FBattery_Status_API),尽管看起来这么酷炫...
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-9.awebp)

- **媒体能力**

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-10.awebp)

- **Cache storage keys**

(注：[Cache storage keys](https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FCacheStorage) 一般用来对 request 和 response 进行缓存)
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-11.awebp)
更多的例子就不一一举例了。

# Ninja console.log （忍者打印）
有时你设置的断点是不是被执行了太多次？假设有一个包含 200 个元素的循环，但是你只对第 110 次循环的结果感兴趣，又或者你只对一些满足某些条件的结果感兴趣，怎么办呢？这就是我们要说的条件断点：
## 1. Conditional breakpoints 条件断点
这样的情况下，你可以设置一个条件断点：

- 右击行号，选择 Add conditional breakpoint...(添加条件断点)
- 或者右击一个已经设置的断点并且选择 Edit breakpoint(编辑断点)
- 然后输入一个执行结果为 true 或者 false 的表达式（它的值其实不需要完全为 true 或者 false 尽管那个弹出框的描述是这样说的）。

在这个表达式中你可以使用任何这段代码可以获取到的值（当前行的作用域）。
如果条件成立，这个断点就会暂停代码的执行：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-12.awebp)

## 2. The ninja（忍者） console.log
得益于条件断点， console.log 也有了新玩法：

- 每一个条件都必须经过判断 - 当应用执行到这一行的时候进行判断
- 并且如果条件返回的是 falsy 的值(这里的 falsy并非是笔误，falsy 指的是被判定为 false 的值，例如 undefined )，它并不会暂停..

与其在你的源码的不同地方去添加 console.log / console.table / console.time 等等，不如你直接使用条件判断来将它们“连接”到 Source 面板中。 这样的话，它们会一直执行，并且当你不再需要它们的时候，在 Breakpoints section 会清晰的列出它们。点两下鼠标你就可以把所有的都移除，就像一堆忍者一样突然消失！

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-13.awebp)

这个技术在调试生产环境的问题时同样很有用，因为你通过这样的方式轻松将 console logs 插入到 source 里。
# 自定义格式转换器
## 前言
大多数的情况下，我们习惯使用 DevTools 的 console 默认对 object 的转换，但有时候我们想用与众不同的方式来处理。 那我们就可以自定义输出对象的函数，它通常被称为 Custom Formatter 。
请注意: 在我们写一个之前，需要在 DevTools 进行设置 (在 DevTools 的 ⋮ 下拉框找到设置，或者按下 F1 ) 中把对应的设置打开:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-14.awebp)
formatter 长什么样呢？ 它是一个对象，最多包含三个方法：

- header : 处理如何展示在 console 的日志中的主要部分。
- hasbody : 如果你想显示一个用来展开对象的 ▶ 箭头，返回 true
- body : 定义将会被显示在展开部分的内容中。

一个基础的自定义 formatter
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-15.awebp)
例子里移除了循环的结构的错误处理，让它看起来更加简洁
header 方法返回了一个 [JsonML](http%3A%2F%2Fwww.jsonml.org%2F) (注： JsonML : JSON Markup Language - JSON 标记语言) 数组，由这些组成：

1. 标签名
2. 属性对象
3. 内容 (文本值或者其他元素)

(如果看起来很眼熟的话，那可能是因为你之前写过一些 [React 代码](https%3A%2F%2Freactjs.org%2Fdocs%2Freact-without-jsx.html) :D)
在输出的时候，这个简单的 formatter 对于每一层嵌套，直接以 7 个空格的缩进打印这个对象。所以现在我们的输出看起来是这样：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-16.awebp)
## 1. 自定义格式化转换器的应用实践
现有好几种 custom formatter 可供选择，例如：你可以在这个 [immutable-devtools](https%3A%2F%2Fgithub.com%2Fandrewdavey%2Fimmutable-devtools)仓库中找到对于 [Immutable.js](https%3A%2F%2Ffacebook.github.io%2Fimmutable-js%2F) 结构的完美展示。但你同样可以自己造一个。
一般来说，每当你遇到结构不寻常的对象时，或大量的日志(最好避免这样的情况，但是有时候很有用)而你想从中做区分时，你可以采用 custom formatter 来处理。
一个很实用的窍门：直接将你不关心，不需要区别对待的对象过滤出来，直接在 header 方法里面 return null。让 DevTools 使用默认的格式化方式来处理这些值。
撇开实用性，我们还可以找点乐子：
这是一个关于 console 的蠢萌例子：它叫做 console.clown() :将打印对象进行转换，而且在对象前面加上一个 emoji 表情 ...
[源码在这里](https%3A%2F%2Fgist.github.com%2Fsulco%2Fe635a7511d5ff17d44fe9bb2ab8b3cc6)为了方便大家尝试，源码贴在下面：
```javascript
window.devtoolsFormatters = [{
    header: function(obj){
      if (!obj.__clown) {
        return null;
      }
      delete obj.__clown;
      const style = `
        color: red;
        border: dotted 2px gray;
        border-radius: 4px;
        padding: 5px;
      `
      const content = `🤡 ${JSON.stringify(obj, null, 2)}`;

      try {
        return ['div', {style}, content]
      } catch (err) { // for circular structures
        return null;  // use the default formatter
      }
    },
    hasBody: function(){
        return false;
    }
}]

console.clown = function (obj) {
  console.log({...obj, __clown: true});
}

console.log({message: 'hello!'});   // normal log
console.clown({message: 'hello!'}); // a silly log
```
如你所见，我使用 console.clown 方法打印出来的对象被添加了一个特殊的属性，便于将它区分出来，并且在 formatter 中对它区别处理，但在大部分现实的案例中，这样更好：比如检查这个对象是不是某一个特殊类的实例等等。
对了，clown 打印出来了什么东西呢？ 在下面：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-17.awebp)


# console中骚操作
## 前言
我最开始接触前端的时候，学会用的就是 console.log ，甚至现在，大部分情况也还在用它调试，但是，在不同的场景下，除了 log ，其实有更好的选择。
## 1. console.assert
在 [MDN](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2Fconsole%2Fassert) 中是这样定义的
```javascript
console.assert(assertion, obj1 [, obj2, ..., objN]);
console.assert(assertion, msg [, subst1, ..., substN]); // c-like message formatting
```
当我们传入的第一个参数为 **假** 时，console.assert 打印跟在这个参数后面的值。
这个方法适用于什么情况呢？举个栗子：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-22.awebp)
通过它，你可以摆脱令人讨厌的 if 表达式，还可以获得堆栈信息。
请注意，**如果你使用的 NodeJS 版本 ≤ 10.0 ， console.assert 可能会中断后面代码的执行**，但是在 .10 的版本中被修复了(当然，在浏览器中不存在这个问题)
## 2. 增强 log 的阅读体验
有时即使你 console.log 一个简单的变量，你可能会忘记（或混淆）哪一个是那个。那当你有不同的变量需要打印的时候，阅读起来会更费劲。
假如有这么一堆你想要输出但看起来并不易读的数据 ![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-23.awebp)
**“哪一个值对应哪一个变量来着？”**
为了让它变得更加易读，你可以打印一个对象 - 只需将所有 console.log 的参数包装在大括号中。感谢 ECMAScript 2015 中引入了 enhanced object literal(增强对象文字面量) ，所以加上 {} 已经是你需要做的全部事情了：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-24.awebp)
## 3.console.table
console.table 这个小技巧在开发者中可能并没有多少人知道: 如果有一个 **数组** (或者是 **类数组** 的对象，或者就是一个 **对象** )需要打印，你可以使用 console.table 方法将它以一个漂亮的表格的形式打印出来。它不仅会根据数组中包含的对象的所有属性，去计算出表中的列名，而且这些列都是可以 **缩放** 甚至 **还可以排序!!!**
如果你觉得展示的列太多了，使用第二个参数，传入你想要展示的列的名字:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-25.awebp)
对于后台而言，只有 node 版本大于 10 以上， console.table 才能起作用
## 4. table 和 {} 的配合
我们刚刚看到了 console.table 这个技巧，也了解了在他上面的 {} ，那么我们为什么不将他们结合起来打造一个终极 log 呢？
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-26.awebp)
## 5. console.dir
有时候你想要打印一个 DOM 节点。 console.log 会将这个交互式的元素渲染成像是从 Elements 中剪切出来的一样。如果说你想要查看 **这个节点所关联到的真实的js对象** 呢？并且想要查看他的 **属性** 等等？
在那样的情况下，就可以使用console.dir:
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-27.awebp)
## 6. 给 logs 加上时间戳
我们总是需要打印各式各样的信息，之前我们讨论了如何让输出的信息更加直观，但是如果我们需要打印相关的时间信息呢？这就用到了计时的相关操作。
如果你想要给你的应用中发生的事件加上一个确切的时间记录，开启 _timestamps_ 。你可以在设置(在调试工具中的 ⋮ 下拉中找到它，或者按下 F1 )中来开启或者使用 [Commands Menu](https%3A%2F%2Fmedium.com%2F%40tomsu%2Fdevtools-tips-day-6-thecommand-menu-449eb3966d9%237404)：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-28.awebp)
## 7.监测执行时间
与其在所有事上展示一个时间戳，或许你对脚本中的特殊的节点之间执行的时间跨度更加感兴趣，对于这样的情况，我们可以采用一对有效的 console 方法

- console.time() — 开启一个计时器
- console.timeEnd() — 结束计时并且将结果在 console 中打印出来

如果你想一次记录多件事，可以往这些函数中传入不同的标签值。(例如: console.time('loading') ， console.timeEnd('loading') )
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-29.awebp)
## 8. 给你的 console.log 加上 CSS 样式
如果你给打印文本加上 %c 那么 console.log 的第二个参数就变成了CSS 规则！这个特性可以让你的日志脱颖而出(例如 [Facebook](https%3A%2F%2Fwww.facebook.com%2F) 在你打开 console 的时候所做的一样)
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-30.awebp)
## 9. 让 console.log 基于调用堆栈自动缩进
配合 Error 对象的 stack 属性，让你的 log 可以根据堆栈的调用自动缩进：
```javascript
function log(message) {
      console.log(
        // 这句话是重点当我们 new 出来的 Error 对象时，会匹配它的stack 信息中的换行符，换行符出现的次数也等同于它在堆栈调用时的深度。
        ' '.repeat(new Error().stack.match(/\n/g).length - 2) + message
      );
    }

    function foo() {
      log('foo');
      return bar() + bar();
    }

    function bar() {
      log('bar');
      return baz() + baz();
    }

    function baz() {
      log('baz');
      return 17;
    }

    foo();
```
运行结果如下：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-31.awebp)
## 10. 直接在回调中使用 console.log
是不是经常有这样的情况，就是我确定要将什么传递给回调函数。在这种情况下，我会在里面添加一个 console.log 来检查。
有两种方式来实现：

- 在回调方法的内部使用 console.log
- **直接使用 consolelog 来作为回调方法**。

我推荐使用第二种，因为这不仅减少了输入，还可能在回调中接收多个参数。(这在第一个解决方案中是没有的)
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-32.awebp)
## 11. 使用实时表达式
在本文形成的不久前，DevTools 在 Console 面板中引入了一个非常漂亮的附加功能，这是一个名为 Live expression 的工具
只需按下 "眼睛" 符号，你就可以在那里定义任何 JavaScript 表达式。 它会不断更新，所以表达的结果将永远，存在 :-)
同时支持定义好几个：
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-4-33.awebp)

