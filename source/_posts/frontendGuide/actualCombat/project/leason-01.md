---
title: 第一节：项目搭建
date: 2024-06-06 10:54:00
post: comments
enable: true
categories: 
- [前端开发手册, 从零开始：手把手教你打造炫酷新页面]
tags: 
- 开发手册
---

# 第一节：项目搭建

大家好，当你点进这个标题，开始阅读本章的时候，说明你对 Vue.js 是充满好奇心和求知欲的。 正如其官网介绍的“易用，灵活和高效”那样。其实框架是 Vue.js 的本质，而真正了解它的人则会把它当成一件作品来欣赏。

Vue.js 作为一门轻量级、易上手的前端框架，从入门难度和学习曲线上相对其他框架来说算是占据优势的，越来越多的人开始投入 Vue.js 的怀抱，走进 Vue.js 的世界。那么接下来屏幕前的你不妨一起来和我从零开始构建一个 Vue 项目，体会一下 Vue.js 的精彩绝伦。


## 环境准备

在构建一个 Vue 项目前，我们先要确保你本地安装了 Node 环境以及包管理工具 npm，打开终端运行：

#### 查看 node 版本

```bash
node -v
```

#### 查看 npm 版本

```bash
npm -v
```

如果成功打印出版本号，说明你本地具备了 ```node``` 的运行环境，我们可以使用 npm 来安装管理项目的依赖，而如果没有或报错，则你需要去 [node 官网](https://nodejs.org/en/download/package-manager) 进行 node 的下载及安装，如图：

![MACOS](../../img/frontendGuide/actualCombat/project/x-0005.png)

![WINDOWS](../../img/frontendGuide/actualCombat/project/x-0006.png)

这里建议大家安装最新的  ```node```  稳定版进行开发，实际开发时需要提前了解项目所使用```node```版本需要进行相关版本安装。接下来的示例采用Node```v18.18.0```版本, 为顺利进行后续示例调试，推荐大家使用```v18.18.0+```版本。


#### 用pnpm替代npm
本次我们使用pnpm替代Node环境自带的依赖管理工具npm。所以需要全局安装pnpm。

```bash
npm install -g pnpm
```

安装时可能需要必要系统权限 

```bash
# MACOS用户需要使用sudo命令
sudo npm install -g pnpm

# Windows用户需要管理员权限
# 管理员权限打开命令行窗口
npm install -g pnpm
```

查看 pnpm 版本, 如果成功打印出版本号，说明你本地的全局pnpm工具已成功安装。

```bash
pnpm -v
```


## 创建项目

执行以下命令创建新项目：

```bash
pnpm create vite my-vue-app --template vue-ts
```

![](../../img/frontendGuide/actualCombat/project/001.png)

进入项目目录：

```bash
cd my-vue-app
```

项目初始化目录如下

![](../../img/frontendGuide/actualCombat/project/x-0001.png)

```bash
├── .vscode  // 编辑器配置
├── node_modules // 项目安装依赖包集合文件夹
├── README.md // 项目手册
├── index.html // 项目主入口HTML 
├── package.json // 依赖配置文件
├── public // 公共静态文件夹, 纯静态资源（文件、图片等） 打包构建时，vite不会做任何处理
│   └── vite.svg // 页签图标文件
├── src // 项目核心文件夹（包括项目源码，各种静态资源）
│   ├── App.vue
│   ├── assets // 资源文件夹，后续出台
│   │   └── vue.svg
│   ├── components // 公共组件文件夹
│   │   └── HelloWorld.vue // 示例组件文件
│   ├── main.ts // vue实例化入口文件，也是整个应用的入口
│   ├── style.css // 基础样式文件
│   └── vite-env.d.ts // TypeScript的智能提示（环境变量）
├── tsconfig.app.json// TypeScript 项目的配置文件
├── tsconfig.json // TypeScript 项目的配置文件
├── tsconfig.node.json // TypeScript 项目的配置文件
└── vite.config.ts // vite项目配置文件(本地开发服务器或者构建等相关配置)
```

## 安装依赖

```bash
pnpm install
```

![](../../img/frontendGuide/actualCombat/project/002.png)


## 启动项目

```bash
pnpm run dev
```

![](../../img/frontendGuide/actualCombat/project/x-0002.png)

浏览器打开  http://localhost:5173  即可看到项目启动成功

![](../../img/frontendGuide/actualCombat/project/x-0003.png)


## 本地开发基础配置

#### 设置本地开发服务器端口号
在 ```vite.config.ts```  中设置本地开发启动端口号，比如如下调整为3000端口。

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000 // vue3 本地项目启动端口号设置
  }
})
```

保存完配置文件后，使用```pnpm run dev```重新启动后，浏览器打开 http://localhost:3000 即可看到新端口访问打开的项目页面。

![](../../img/frontendGuide/actualCombat/project/x-0007.png)

![](../../img/frontendGuide/actualCombat/project/x-0008.png)

## 结语

本节课程结束了，恭喜你成功创建了一个基于 Vue 3、Vite 和 TypeScript 的前端项目，并完成了基本的端口配置。接下来，我们将继续深入学习，快速上手项目开发。最终，我们将一起完成一个常见的检索表格功能（如下图所示）。本节完整源码可在 [gitlab](http://gitlab.it.5i5j.com/fex/my-vue-app/tree/leason-01) 查看。

![](../../img/frontendGuide/actualCombat/project/x-0004.png)
