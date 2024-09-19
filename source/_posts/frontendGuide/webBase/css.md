---
title: CSS：让你的代码不再一团糟的神奇法则！
date: 2024-06-05 20:00:00
post: comments
enable: true
categories:
  - 前端开发手册
tags:
  - CSS开发规范
---

# CSS 开发规范

## 目录

1. [CSS 的基本语法](#css)
2. [选择器、属性和值](#css)
   - [选择器](#selector)
   - [属性和值](#value)
3. [盒模型](#box)
4. [布局](#layout)
   - [浮动布局](#float)
   - [定位布局](#position)
   - [弹性布局](#flex)
   - [网格布局](#grid)
5. [CSS3 新特性](#css3)
6. [响应式设计和媒体查询](#media)
7. [预处理器](#precss)
   - [sass](#sass)
   - [less](#less)

<a name="css"></a>

## 1.css 的基本语法

- CSS 规则由两个主要的部分构成：选择器，以及一条或多条声明；

```css
选择器 {
  属性: 值;
}
```

- **选择器**：用于选择 HTML 元素。
- **属性**：要设置的样式属性，如颜色、字体大小等。
- **值**：属性的具体值。

* 在这个例子中，h1 是选择器，color 和 font-size 是属性，red 和 14px 是值。

```css
h1 {
  color: red;
  font-size: 14px;
}
```

css 结构拆解图：
![alt text](../../img/frontendGuide/css-1.png)

<a name="css"></a>

### 2. 选择器、属性和值

<a name="selector"></a>

#### 2.1. 选择器

#### 2.1.1 id 选择器

- id 选择器可以为标有特定 id 的 HTML 元素指定特定的样式。
- id 选择器以 "#" 来定义。

```css
#red {
  color: red;
}
#green {
  color: green;
}
** 派生选择器 通过依据元素在其位置的上下文关系来定义样式 * #sidebar p {
  font-style: italic;
  text-align: right;
  margin-top: 0.5em;
}
```

```html
<p id="red">这个段落是红色。</p>
```

#### 2.1.2 类 选择器

- class 选择器可以为标有特定 class 的 HTML 元素指定特定的样式。
- class 选择器以 "." 来定义。

```css
.center {
  text-align: center;
}
```

```html
<h1 class="center">这个标题将居中</h1>
<p class="center">这个段落将居中</p>
```

#### 2.1.3 元素选择器

- CSS 2 引入了属性选择器。
- 属性选择器可以根据元素的属性及属性值来选择元素。
- 如果希望选择有某个属性的元素，而不论属性值是什么，可以使用简单属性选择器。

```css
// 把包含标题（title）的所有元素变为红色
*[title] {
  color: red;
}
//对有 href 属性的锚（a 元素）应用样式
a[href] {
  color: red;
}
```

#### 2.1.4 后代选择器

- 后代选择器（descendant selector）又称为包含选择器。
- 后代选择器可以选择作为某元素后代的元素。

```css
// 对 h1 元素中的 em 元素应用样式
h1 em {
  color: red;
}
```

```html
<h1>这是一个 <em>重要的</em> 头部</h1>
<p>这是一个 <em>重要的</em> 段落.</p>
```

##### 2.1.5 子元素选择器

- 如果您不希望选择任意的后代元素，而是希望缩小范围，只选择某个元素的子元素，请使用子元素选择器（Child selector）。

```css
// 作为 h1 元素子元素的 strong 元素
h1 > strong {
  color: red;
}
```

```html
// 这个规则会把第一个 h1 下面的两个 strong 元素变为红色，但是第二个 h1 中的
strong 不受影响：
<h1>This is <strong>very</strong> <strong>very</strong> important.</h1>
<h1>
  This is <em>really <strong>very</strong></em> important.
</h1>
```

##### 2.1.6 相邻选择器

- 相邻兄弟选择器（Adjacent sibling selector）可选择紧接在另一元素后的元素，且二者有相同父元素。

```css
// 要增加紧接在 h1 元素后出现的段落的上边距
h1 + p {
  margin-top: 50px;
}
```

<a name="value"></a>

#### 2.2. 属性和值

```css
/* 设置颜色 */
color: red;

/* 设置字体大小 */
font-size: 14px;

/* 设置边距 */
margin: 10px;

/* 设置背景颜色 */
background-color: #f0f0f0;

/* 设置宽度 */
width: 100px;
```

<a name="box"></a>

## 3. 盒模型

当对一个文档进行布局（layout）的时候，浏览器的渲染引擎会根据标准之一的 CSS 基础框盒模型（CSS basic box model），将所有元素表示为一个个矩形的盒子（box）
一个盒子由四个部分组成：content、padding、border、margin
![alt text](../../img/frontendGuide/css-2.png)
content，即实际内容，显示文本和图像

## 3. 盒模型

padding，即内边距，清除内容周围的区域，内边距是透明的，取值不能为负，受盒子的 background 属性影响

margin，即外边距，在元素外创建额外的空白，空白通常指不能放其他元素的区域

#### 下面来段代码：

```html
<style>
  .box {
    width: 200px;
    height: 100px;
    padding: 20px;
  }
</style>
<div class="box">盒子模型</div>
```

当我们在浏览器查看元素时，却发现元素的大小变成了 240px

这是因为，在 CSS 中，盒子模型可以分成：

- W3C 标准盒子模型
- IE 怪异盒子模型
- 默认情况下，盒子模型为 W3C 标准盒子模型

#### W3C 标准盒子模型

- 元素的 width、height 只包含 content，不包含 padding 和 border 值
- 盒子实际大小取决于 width+padding+border

### W3C 标准盒子模型

#### IE 怪异盒子模型

- 元素的 width、height 不仅包括 Content，还包括 padding 和 border 值
- 盒子实际的大小取决于 width

![alt text](../../img/frontendGuide/css-3.png)

> css3 中引入了 box-sizing 属性，box-sizing:content-box 表示标准盒子模型，box-sizing:border-box 表示 IE 盒子模型
> <a name="layout"></a>

## 4. 布局

<a name="float"></a>

### 4.1 浮动布局

使用 `float` 属性可以让元素浮动。

```css
.float-container {
  float: left;
  width: 50%;
}
```

浮动元素会脱离文档流，其他内容将环绕浮动元素。

### 4.2 定位布局

使用 `position` 属性可以对元素进行定位。

- **static**：默认值，无定位。
- **relative**：相对定位，相对于其正常位置进行定位。
- **absolute**：绝对定位，相对于最近的已定位祖先元素进行定位。
- **fixed**：固定定位，相对于浏览器窗口进行定位。
- **sticky**：粘性定位，在 `relative` 和 `fixed` 之间切换。

示例：

```css
.relative {
  position: relative;
  top: 10px;
  left: 20px;
}
```

<a name="flex"></a>

### 4.3 弹性布局（Flexbox）

Flexbox 是一种用于布局的强大工具。

#### 4.3.1 Flex 容器属性

```css
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
```

- **display: flex**：定义一个 flex 容器。
- **justify-content**：定义主轴（水平轴）上的对齐方式。
- **align-items**：定义交叉轴（垂直轴）上的对齐方式。
- **flex-wrap**：定义是否换行。

#### 4.3.2 Flex 项目属性

```css
.flex-item {
  flex: 1;
  order: 2;
  align-self: flex-start;
}
```

- **flex**：定义项目的伸缩能力。
- **order**：定义项目的排列顺序。
- **align-self**：覆盖容器的 `align-items` 属性。


### 4.4 网格布局（Grid）

Grid 提供了二维布局的能力。

#### 4.4.1 Grid 容器属性

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 200px;
  gap: 10px;
}
```

- **display: grid**：定义一个 grid 容器。
- **grid-template-columns**：定义列的数量和宽度。
- **grid-template-rows**：定义行的数量和高度。
- **gap**：定义网格项之间的间距。

#### 4.4.2 Grid 项目属性

```css
.grid-item {
  grid-column: 1 / span 2;
  grid-row: 1 / 3;
}
```

- **grid-column**：定义项目在列中的位置。
- **grid-row**：定义项目在行中的位置。

<a name="css3"></a>

## 5. CSS3 新特性

CSS3 引入了许多新特性，包括：

### 5.1 圆角

使用 `border-radius` 属性可以创建圆角。

```css
.rounded {
  border-radius: 10px;
}
```

### 5.2 阴影

使用 `box-shadow` 和 `text-shadow` 属性可以添加阴影效果。

```css
.shadow {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 2px black;
}
```

### 5.3 渐变

使用 `linear-gradient` 和 `radial-gradient` 属性可以创建渐变背景。

```css
.gradient {
  background: linear-gradient(to right, red, yellow);
}
```

### 5.4 过渡

使用 `transition` 属性可以创建平滑的过渡效果。

```css
.transition {
  transition: all 0.3s ease-in-out;
}
```

### 5.5 动画

使用 `@keyframes` 和 `animation` 属性可以创建动画。

```css
@keyframes example {
  from {
    background-color: red;
  }
  to {
    background-color: yellow;
  }
}

.animation {
  animation: example 5s infinite;
}
```

<a name="media"></a>

## 6. 响应式设计和媒体查询

响应式设计旨在创建在各种设备上都能良好显示的网页。使用媒体查询可以根据不同的屏幕尺寸应用不同的样式。

```css
@media (max-width: 600px) {
  .responsive {
    background-color: lightblue;
  }
}
```

<a name="precss"></a>

## 7. 预处理器

预处理器允许使用更复杂的语法，生成标准的 CSS 文件。常见的预处理器包括 Sass 和 Less。

<a name="sass"></a>

### 7.1 SASS 介绍

#### 7.1.1 什么是 SASS？

SASS（Syntactically Awesome Stylesheets）是一种扩展 CSS 的预处理语言，增加了变量、嵌套、混合、继承等功能，帮助开发者更有效地管理和编写样式代码。

#### 7.1.2 SASS 文件扩展名

- `.sass`：缩进语法（Indented Syntax）
- `.scss`：Sassy CSS 语法（类似于 CSS 的语法）

#### 7.1.3 SASS 特性

#### 7.1.4 变量 (Variables)

SASS 允许使用变量存储值，如颜色、字体或任何 CSS 值，这使得样式更加灵活和易于维护。

`示例`：

```scss
// 定义变量
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;

// 使用变量
body {
  color: $primary-color;
  font-family: $font-stack;
}
```

#### 7.1.5 嵌套 (Nesting)

SASS 允许将 CSS 选择器嵌套在一起，这样可以更清晰地表示层级结构。

`示例`：

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
  }

  a {
    text-decoration: none;
    color: $primary-color;

    &:hover {
      color: darken($primary-color, 10%);
    }
  }
}
```

#### 7.1.6 混合 (Mixins)

混合是可重用的样式块，可以带参数。它们类似于函数，可以在多个地方调用，减少重复代码。

`示例`：

```scss
// 定义混合
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

// 使用混合
.button {
  @include border-radius(10px);
  background-color: $primary-color;
}
```

#### 7.1.6 继承 (Inheritance)

SASS 允许一个选择器继承另一个选择器的样式，从而减少重复代码。

`示例`：

```scss
// 基础样式
%button-style {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: $primary-color;
}

// 继承样式
.button {
  @extend %button-style;
  border: none;
  cursor: pointer;
}
```

#### 7.1.7 部件 (Partials) 和 导入 (Import)

SASS 允许将样式分成多个文件，并在主文件中导入，便于管理和维护。

`示例`：
// \_variables.scss

```scss
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;
```

// \_base.scss

```scss
body {
  font-family: $font-stack;
  color: $primary-color;
}
```

// main.scss

```scss
@import "variables";
@import "base";
```

#### 7.1.8 函数 (Functions)

SASS 提供了一些内置函数，并允许开发者定义自己的函数，用于计算和处理值。

`示例`：

```scss
// 定义函数
@function calculate-rem($size, $base: 16px) {
  @return $size / $base * 1rem;
}

// 使用函数
.container {
  font-size: calculate-rem(18px);
}
```

#### 7.1.9 运算 (Operations)

SASS 支持在样式中进行数学运算，如加减乘除。

`示例`：

```scss
.container {
  width: 100% - 20px;
  margin: 10px + 5px;
  padding: 20px / 2;
}
```

#### 7.2.0 SASS 编译

SASS 文件需要编译成标准的 CSS 文件才能在网页中使用。可以使用以下工具进行编译：

- 命令行工具（sass）
- 任务运行器（如 Gulp、Grunt）
- 模块打包器（如 Webpack）

#### 命令行编译示例：

```bash
sass input.scss output.css
```

<a name="less"></a>

## 7.2 Less 介绍

Less 也是一种流行的 CSS 预处理器，具有类似于 Sass 的功能。

LESS（Leaner Style Sheets）是一种动态样式表语言，扩展了 CSS，增加了变量、混合、嵌套规则和函数等功能，使 CSS 更加灵活和易于维护。LESS 由 JavaScript 编写，可以在客户端和服务器端运行。以下是 LESS 的基础教程。

#### 7.2.1 环境配置

##### 客户端

1. 下载并引入 LESS 库：

   ```html
   <link rel="stylesheet/less" type="text/css" href="styles.less" />
   <script src="https://cdn.jsdelivr.net/npm/less@4.1.1/dist/less.min.js"></script>
   ```

2. 使用 `.less` 文件编写样式，浏览器会自动编译。

##### 服务端

1. 安装 LESS 编译器：

   ```sh
   npm install -g less
   ```

2. 编译 LESS 文件：
   ```sh
   lessc styles.less styles.css
   ```

##### 变量

LESS 允许使用变量来存储值，如颜色、字体大小、边距等。

```less
@primary-color: #4caf50;
@padding: 10px;

.button {
  color: @primary-color;
  padding: @padding;
}
```

##### 嵌套规则

嵌套规则使得层级结构更加清晰。

```less
.navbar {
  background: #333;
  .nav-item {
    color: #fff;
    &:hover {
      color: @primary-color;
    }
  }
}
```

##### 混合 (Mixins)

混合允许将一组 CSS 声明重用到多个选择器中。

```less
.border-radius(@radius) {
  border-radius: @radius;
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
}

.button {
  .border-radius(5px);
}
```

##### 继承 (Extend)

继承允许一个选择器继承另一个选择器的样式。

```less
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  &:extend(.message);
  border-color: green;
}
```

##### 操作符

LESS 支持数学运算和颜色操作。

```less
@width: 100px;
@height: @width + 50px;

.box {
  width: @width;
  height: @height;
  background-color: lighten(@primary-color, 20%);
}
```

##### 函数

LESS 提供了许多内置函数，如 `darken`、`lighten`、`fade` 等。

```less
@base-color: #000;

.header {
  color: lighten(@base-color, 20%);
}
```

##### 导入

LESS 允许将一个 LESS 文件导入到另一个文件中。

```less
@import "variables.less";
@import "mixins.less";

body {
  color: @text-color;
}
```
