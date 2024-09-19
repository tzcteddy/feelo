---
title: 网页的骨架：HTML 奇幻之旅
date: 2024-06-05
post: comments
enable: true
categories: 
- [前端开发手册, 网页基石：HTML & CSS 的神奇组合]
tags: 
- 开发手册
---

#### 1. HTML 的基本结构

HTML（Hyper Text Markup Language，即超文本标记语言）的基本结构分为四大部分：

1. **文档声明 (Document Type Declaration, DOCTYPE)**：
   - 这是一个指令，告诉浏览器文档遵循的 HTML 规范版本。对于 HTML5，声明如下：`<!DOCTYPE html>`。这行代码位于 HTML 文件的第一行，它不是 HTML 标签，而是 XML 声明的一部分。

2. **HTML 根元素**：
   - `<html>` 标签是整个 HTML 文档的根元素，它包含所有其他 HTML 元素。

3. **头部元素**：
   - `<head>` 标签包含有关文档的信息，比如标题、字符集设置、样式表（CSS）引用、脚本（JS）引用等。其中脚本引用也可以放在 `<body>` 里。

4. **主体元素**：
   - `<body>` 标签包含网页的主体部分，比如文本、图像、表格、列表、链接等。

下面是一个完整的 HTML 文档的例子：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="description" content="HTML 技术教程。" />
        <meta name="keywords" content="HTML, CSS">
        <title>我的HTML页面</title>
        <style>CSS 样式</style>
        <script>script 脚本</script>
    </head>
    <body>
        <h1>欢迎来到我的网站！</h1>
        <p>这是一个段落。</p>
    </body>
</html>
```

#### 2. 常用标签

HTML 的常用标签主要分为以下几类（HTML5 新增的标签会在后面 HTML5 新特性一章介绍）：

##### 2.1. 文档结构标签

- `html`：文档的根元素
- `head`：文档的头部，包含文档的标题、字符集、CSS 样式表、JS 脚本等。
- `body`：文档的主体部分，包含文档的文本、图片、表格、列表等。

##### 2.2. 文本内容标签

- `h1` 到 `h6`：标题。
- `p`：段落。
- `a`：超链接。
- `br`：换行。
- `div`：块级元素，用于定义一个区域。
- `span`：行内元素，用于定义一个区域。

##### 2.3. 列表标签

- `ul`：无序列表。
- `ol`：有序列表。
- `li`：列表项。

##### 2.4. 图片和多媒体标签

- `img`：图片。
- `audio`：音频。
- `video`：视频。
- `iframe`：内嵌网页，可以加载另一个 HTML 文档。

##### 2.5. 表格标签

- `table`：表格。
- `tr`：表格行。
- `th`：表头单元格。
- `td`：数据单元格。

##### 2.6. 表单标签

- `form`：表单。
- `input`：输入框。
- `button`：按钮。
- `select`：下拉框。
- `textarea`：文本域。
- `label`：标签。
- `radio`：单选按钮。
- `checkbox`：复选框。

##### 2.7. 布局和样式控制

- `div`：块级元素，用于定义一个区域。
- `span`：行内元素，用于定义一个区域。
- `link`：链接的 CSS 样式表文件。
- `style`：在文件内写的样式。

#### 3. 表单元素

HTML 的表单元素用于收集用户输入的数据，并将其提交给服务器进行处理的关键组成部分。以下是表单的一些核心元素和属性：

##### 3.1. 表单容器

- `form`：所有表单元素都应包含在这个标签内。

##### 3.2. 文本输入框

- `input` 是最常用的表单元素之一。通过 `type` 属性定义不同的输入类型，如文本、密码、日期等。
- `type="text"`：文本输入框。
- `type="password"`：密码输入框。
- `type="email"`：邮箱输入框。
- `type="number"`：数字输入框。
- `type="file"`：文件上传框。
- `type="submit"`：提交按钮。
- `type="reset"`：重置按钮。
- `type="button"`：按钮。
- `type="image"`：图片按钮。
- `type="hidden"`：隐藏域。
- `type="checkbox"`：复选框。
- `type="radio"`：单选按钮。
- `type="range"`：滑块输入框。
- `type="color"`：颜色选择框。
- `type="tel"`：电话号码输入框。
- `type="url"`：URL 输入框。
- `type="search"`：搜索框。
- `type="date"`：日期输入框。
- `type="time"`：时间输入框。
- `type="week"`：周选择框。
- `type="month"`：月选择框。
- `type="datetime-local"`：日期和时间选择框。

##### 3.3. 多行文本输入

- `textarea`：多行文本，可通过 `rows` 和 `cols` 属性设置行数和列数。

```html
<textarea name="feedback" rows="4" cols="50"></textarea>
```

##### 3.4. 单选按钮 (radio)

```html
<input type="radio" name="gender" value="male">男
<input type="radio" name="gender" value="female">女
```

##### 3.5. 复选框 (checkbox)

```html
<input type="checkbox" name="gender" value="male">男
<input type="checkbox" name="gender" value="female">女
```

##### 3.6. 下拉框 (select)

```html
<select id="country" name="country">
    <option value="cn">CN</option>
    <option value="usa">USA</option>
    <option value="uk">UK</option>
</select>
```

##### 3.7. 按钮 (button)

```html
<button>保存</button>
```

下面是一个完整的 form 表单的例子：

```html
<form action="/" method="post">
    <!-- 文本输入框 -->
    <label for="name">用户名:</label>
    <input type="text" id="name" name="name" required>

    <br>

    <!-- 密码输入框 -->
    <label for="password">密码:</label>
    <input type="password" id="password" name="password" required>

    <br>

    <!-- 单选按钮 -->
    <label>性别:</label>
    <input type="radio" id="male" name="gender" value="male" checked>
    <label for="male">男</label>
    <input type="radio" id="female" name="gender" value="female">
    <label for="female">女</label>

    <br>

    <!-- 复选框 -->
    <input type="checkbox" id="subscribe" name="subscribe" checked>
    <label for="subscribe">订阅推送信息</label>

    <br>

    <!-- 下拉列表 -->
    <label for="country">国家:</label>
    <select id="country" name="country">
        <option value="cn">CN</option>
        <option value="usa">USA</option>
        <option value="uk">UK</option>
    </select>

    <br>

    <!-- 提交按钮 -->
    <input type="submit" value="提交">
</form>
```

#### 4. 语义化标签的使用

HTML 的语义化标签，简而言之就是让特定的标签去做特定的事。语义化标签的使用使得页面结构更加清晰，便于开发者阅读和维护，同时也有助于搜索引擎和辅助技术（如屏幕阅读器）更好地识别页面内容。

##### 常见的语义化标签及其用途：

- `header`：用于表示页面或节的标题。
- `nav`：用于表示导航链接。
- `main`：用于表示页面的主要内容。
- `article`：用于表示独立的文章或内容块。
- `section`：用于表示页面的一部分。
- `aside`：用于表示页面的附加信息。
- `footer`：用于表示页面或节的页脚。

| 标签名    | 英文全称       | 中文说明         |
| --------- | -------------- | ---------------- |
| h1~h6     | Header 1 to 6  | 标题 1 到 标题 6 |
| iframe    | Inline frame   | 定义内联框架     |
| ul        | Unordered List | 不排序列表       |
| li        | List Item      | 列表项目         |
| ol        | Ordered List   | 排序列表         |

#### 5. HTML5 的新特性

* HTML5 技术结合了 HTML4.01 的相关标准并革新，符合现代网络发展要求，在 2008 年正式发布。主要包括以下几方面：

##### 5.1 语义化标签

新增几个语义化标签：

- `section`：代表文档中的一段或者一节；
- `nav`：用于构建导航；
- `article`：表示文档、页面、应用程序或网站中一体化的内容；
- `aside`：代表与页面内容相关、有别于主要内容的部分；
- `hgroup`：代表段或者节的标题；
- `header`：页面的页眉；
- `footer`：页面的页脚；
- `time`：表示日期和时间；
- `mark`：文档中需要突出的文字。

##### 5.2 表单增强

引入新的表单元素和属性：

- 日期选择器：`<input type="date">`
- 其他新类型：`email`、`password`、`time`、`range`（滑块）、`color`（选择颜色的控件）、`search`
- `placeholder` 属性：简短的提示在用户输入值前会显示在输入域上。
- `required` 属性：要求填写的输入域不能为空。
- `pattern` 属性：描述一个正则表达式用于验证 `<input>` 元素的值。
- `min` 和 `max` 属性：设置元素最小值与最大值。
- `step` 属性：为输入域规定合法的数字间隔。
- `autofocus` 属性：规定在页面加载时，域自动地获得焦点。
- `multiple` 属性：规定 `<input>` 元素中可选择多个值。

##### 5.3 绘图画布 Canvas 和 SVG

Canvas 和 SVG 都是 HTML5 中的图形渲染技术，用于在网页中呈现动态或静态图形。

- **Canvas**：
  - 使用 JavaScript 来绘制图形。
  - 提供一个位图渲染环境，可以直接操作像素，适合处理图像、视频和游戏等需要高性能的场景。
  - 可以通过绘制形状、图像和文本来创建图形，使用各种绘图方法和属性来控制线条、填充和阴影等效果。

- **SVG**：
  - 使用 XML 描述 2D 图形的格式。
  - 可以缩放到任意大小而不失真，并且可以在不同的平台和设备上以相同的方式呈现。
  - 使用矢量图形而不是像素，可以轻松地编辑和修改，并支持更多的交互性和动画效果，常用于页面中一些小图标。

##### 5.4 多媒体

支持音频和视频播放，无需依赖第三方插件 Flash：

- **视频播放**：`<video>`
- **音频播放**：`<audio>`
- `src`：音视频的地址
- `controls`：音频播放控制器
- `autoplay`：自动播放
- `loop`：循环播放
- `poster`：指定视频封面图的 URL

##### 5.5 地理定位

在 HTML5 中有一个 `navigator.geolocation` 的特性来判断是否支持获取地理位置。地理位置的定位有 GPS，IP 地址，WiFi，GSM/CDMA 几种方法。

- `navigator.geolocation` 有三个方法：
  1. `getCurrentPosition()`：获取当前位置。
     ```javascript
     navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
     ```
  2. `watchPosition()`：定期轮询设备的位置。
  3. `clearWatch()`：停止 `watchPosition()` 轮询。

##### 5.6 数据存储

HTML5 提供的数据持久化技术（离线存储）：

- **Application Cache**：本地缓存应用所需的文件
- **LocalStorage 和 SessionStorage**：以键值对（JSON 串）格式存储数据
- **Web SQL**：关系数据库，通过 SQL 语句访问
- **IndexDB**：索引数据库

- **localStorage**：
  - 永久级别的存储。再次访问同一个域名中的任何页面，都可以提取到数据。只要浏览器不卸载，数据就会一直存在。可以手动删除数据。

  ```javascript
  // 存储数据
  localStorage.setItem('key', 'value');
  // 获取数据
  let value = localStorage.getItem('key');
  // 删除数据
  localStorage.removeItem('key');
  // 清空所有数据
  localStorage.clear();
  ```

- **sessionStorage**：
  - 会话级别的存储。仅在当前页面中有效，页面关闭数据销毁，页面之间不可以互相访问。

  ```javascript
  // 存储数据
  sessionStorage.setItem('key', 'value');
  // 获取数据
  let value = sessionStorage.getItem('key');
  // 删除数据
  sessionStorage.removeItem('key');
  // 清空所有数据
  sessionStorage.clear();
  ```

*注：*

1. `localStorage` 和 `sessionStorage` 从名字可以辨认出二者的区别。前者是一直存在本地的，后者只是伴随着会话，窗口一旦关闭就没了。使用上完全相同，具有相同的 API。
2. 本地存储数据的格式是 JSON 串（key-value 形式）。
3. 存储数据大小限制：每个域名 5M。

##### 5.7 多线程

JavaScript 语言的一大特点就是单线程，同一时间只能做一件事。单线程始终是一个痛点。为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程。但子线程完全受主线程控制，且不得操作 DOM，所以这个新标准并没有改变 JavaScript 单线程的本质。

Web Workers 是现代浏览器提供的一个 JavaScript 多线程解决方案，使用场景包括：

1. 进行大计算量的操作；
2. 实现轮询，改变某些状态；
3. 页头消息状态更新，如页头的消息个数通知；
4. 高频用户交互，如拼写检查；
5. 加密，如发往服务器前加密数据；
6. 预取数据，为优化网站或网络应用及提升数据加载时间提前加载部分数据。

#### 6. 本地存储

##### 6.1 localStorage:

提供了在浏览器关闭后仍然保持数据的能力，数据存储在客户端，并没有过期时间，但有大小限制 5M。

```javascript
// 存储数据
localStorage.setItem('key', 'value');

// 获取数据
let value = localStorage.getItem('key');

// 删除数据
localStorage.removeItem('key');

// 清空所有数据
localStorage.clear();
```

1. **作用域**：localStorage 只要在相同的协议（如 http）、相同的主机名（host）、相同的端口下（如 8080），就能读取/修改到同一份 localStorage 数据。

2. **生存期**：localStorage 理论上来说是永久有效的，即不主动清空的话就不会消失，即使保存的数据超出了浏览器所规定的大小，也不会把旧数据清空而只会报错。

3. **数据结构**：localStorage 为标准的键值对（Key-Value, 简称 KV）数据类型，简单但也易扩展，只要以某种编码方式把想要存储进 localStorage 的对象转化成字符串，就能轻松支持。

    可以使用 JSON.stringify() 和 JSON.parse() 方法来转换。

    举个例子：把对象转换成 JSON 字符串，就能让存储对象了；把图片转换成 DataUrl（base64），就可以存储图片了。

    另外对于键值对数据类型来说，“键是唯一的”这个特性也是相当重要的，重复以同一个键来赋值的话，会覆盖上次的值。

4. **过期时间**：localStorage 是不支持设置过期时间的。但是可以通过自己设置时间和 removeItem、clear 方法结合来实现。

5. **大小限制**：5M。

##### 6.2 sessionStorage:

用于临时保存同一窗口（或标签页）的数据，在关闭窗口或标签页后将会删除这些数据。

```javascript
// 存储数据
sessionStorage.setItem('key', 'value');

// 获取数据
let value = sessionStorage.getItem('key');

// 删除数据
sessionStorage.removeItem('key');

// 清空所有数据
sessionStorage.clear();
```

1. **作用域**：sessionStorage 操作限制在单个标签页中，在此标签页中进行同源页面访问都可以共享 sessionStorage 数据。同源策略限制，若想在不同页面之间对同一个 sessionStorage 对象进行操作，这些页面必须在同一个协议、同一个主机名和同一个端口下。

2. **生存期**：sessionStorage 理论上来说是永久有效的，即不主动清空的话就不会消失，即使保存的数据超出了浏览器所规定的大小，也不会把旧数据清空而只会报错。

3. **数据结构**：sessionStorage 为标准的键值对（Key-Value, 简称 KV）数据类型，简单但也易扩展，只要以某种编码方式把想要存储进 sessionStorage 的对象转化成字符串，就能轻松支持。

    可以使用 JSON.stringify() 和 JSON.parse() 方法来转换。

    举个例子：把对象转换成 JSON 字符串，就能让存储对象了；把图片转换成 DataUrl（base64），就可以存储图片了。

    另外对于键值对数据类型来说，“键是唯一的”这个特性也是相当重要的，重复以同一个键来赋值的话，会覆盖上次的值。

4. **过期时间**：sessionStorage 是不支持设置过期时间的。但是可以通过自己设置时间和 removeItem、clear 方法结合来实现。

5. **大小限制**：5M。

##### 6.3 cookie

HTTP 协议本身是无状态的，这和 HTTP 最初的设计是相符的，每次请求都是创建一个短连接，发送请求，得到数据后就关闭连接。即每次连接都是独立的一次连接。

这样的话，导致的问题就是当我在一个页面登陆了账号之后，点击连接打开的新界面或者关闭后再打开我都需要再次登陆账号，所以我们需要借助 Cookie 和 Session 来记录网页的状态。

Cookie，有时也用其复数形式 Cookies。可以简单地理解为存储在浏览器的文本数据。

Cookie 按域名来进行存储，不同的域名存储的 Cookie 互相之间不能访问，是隔绝的。而在当前域名存在 Cookie 时，每次向服务端进行请求时都会在 HTTP 请求头中，把当前域名下的所有 Cookie 都一起进行提交。这样服务端就可以获取当前网站存储的所有 Cookie 数据。

1. **Cookie 的作用**就是用于解决 "如何记录客户端的用户信息"，存储于用户电脑上的文本文件中。当用户访问 web 页面时，他的名字可以记录在 cookie 中。在用户下一次访问该页面时，可以在 cookie 中读取用户访问记录。

2. **Cookie 以 key-value 对形式存储**，如：`username=John Doe`

3. 当浏览器从服务器上请求 web 页面时，属于该页面的 cookie 会被添加到该请求中（cookie 会在同源的 http 请求携带），服务端通过这种方式来获取用户的信息。

4. 前端、后端都可以单独的操作 Cookie，对其进行增删改查。

5. JavaScript 可以使用 `document.cookie` 属性来创建、读取及删除 cookie。

Cookie 可以保存数据一段时间，只需要设置过期时间，过期时间到了，数据才会被删除；也可以是临时 cookie/会话 cookie，关闭浏览器，数据就会被删除。

一些需要注意的地方：

- **可能会被用户禁用**：Cookie 是保存在浏览器端的，所以用户有权利选择关闭 Cookie。
- **存储大小有限制**：不同的浏览器都对 Cookie 的存储大小有限制，Cookie 不宜存储过多的数据，不超过 4k。
- **容易被删除**：用户可以随时清空 Cookie。
- **安全性不够高**：Cookie 是用明文的方式存储的，不适合保存敏感的数据。

6. **Cookie 与 Session 的区别**：

- Cookie 是客户端信息，Session 是服务端信息；
- Session 在客户端中，通过 Cookie 记录；
- 非 Session 的 Cookie 不会随着浏览器关闭而消失，Session 会消失；
- Session 过期，导致回话过期，网站重新登录等等。