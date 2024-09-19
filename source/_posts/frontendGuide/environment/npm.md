---
title: npm 介绍：Node.js 项目管理的利器
date: 2024-06-2 11:07:59
post: comments
enable: true
categories: 
- [前端开发手册, 前端新手村：环境配置轻松上手]
tags: 
- 开发手册
---
# npm的安装与使用

## 什么是 npm

+ npm（全称 Node Package Manager）是一个软件包管理系统，专门管理用 JavaScript 编写的软件包。可以免费下载别人写好的 js软件包，并用到项目中，当然也可以上传共享自己写的 js软件包。

+ Node.js 内置了npm，只要安装了node.js，就可以直接使用 npm
+ 安装完 node.js 后，把npm更新到最新版本:
```
npm install npm@latest -g
```

## 项目中使用npm

### 初始化
根据提示填写对应信息，即可产生package.json 文件
```
cd <项目根目录>
npm init 
```

### 使用 npm 下载安装包
```
# 安装需要使用的包
npm install lodash

# 安装完成后，package.json 中会添加版本信息，如下：
{
  "dependencies": {
    "lodash": "^1.0.0"
  }
}
```

### 使用安装的包
```
var lodash = require('lodash');
var output = lodash.without([1, 2, 3], 1);
console.log(output);

```

### 更新包
```
# 法一：根据版本号更新
npm install lodash@版本号

# 法二：更新最新版本
npm install lodash
npm install lodash@latest

# 法三：修改 package.json 中包的版本号，下一次npm install会自动更新会修改后的版本。

```

## 常用命令
```
# 全局安装 lodash
npm install -g lodash

# 本地安装 lodash（默认安装最新版本）
npm install lodash
npm install lodash@latest

# 安装指定版本
npm install lodash@1.0.0

# 卸载
npm uninstall lodash 

# 查看已安装
npm ls 

# 更新 lodash 到最新版本
npm update lodash 

# 搜索 lodash
npm search lodash 
```
## 常见错误

### Error: Cannot find module
+ 当出现如下错误提示，表示 packages 没有被安装：
```
module.js:340
    throw err;
          ^
Error: Cannot find module 'lodash'
```
+ 解决方案：
```
# 无作用域包安装
npm install <package_name>

# 有作用域包安装
npm install <@scope/package_name>
```

### 安装出错
错误提示：npm resource busy or locked..... 可以先清除再重新安装：
```
npm cache clean
npm install

```

## 版本控制符
版本号有三位数字组成（譬如：1.2.3），1 表示主版本、1.2表示次要版本、1.2.3 表示补丁版本。
^  表示用于确定主版本号、 ~  用于确定主版本号 + 次要版本号；

+ ^1 ：等同于 1.x.x ,  以1开头的所有版本；
+ ~2.2 ：等同于 2.2.x ，以  2.2  开头的所有版本。
+ ~2.2.1 ：以  2.2  开头，且最后一位 补丁号≥1 的所有版本，即 2.2.1  与 2.2.9 之间版本，包括头尾。

```
// 可使用在package.json中
"dependencies": {
  "my_dep": "^1.0.0",
  "another_dep": "~2.2.0"
},
```
# nrm 的安装和使用
npm 默认镜像源是 https://registry.npmjs.org/，在国内访问可能会很慢。后来，淘宝做了一个镜像网站（[npmmirror](https://www.npmmirror.com/)），以便国内开发者访问。

使用 ```npm``` 命令，设置设置镜像源：

```
$ npm config set registry https://registry.npmmirror.com/
```
命令有点长，特别是源地址，不好记。下文将会介绍使用 nrm 来快速切换。

## 安装和使用

### 全局安装
```
$ npm i -g nrm
```

### 查看所有源
```
$ nrm ls

* npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://www.npmmirror.com/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/

```
### 切换源

```
$ nrm use <registry>
```

### 添加源

适用于企业内部定制的私有源，```<registry>``` 表示源名称，```<url>``` 表示源地址。

```
$ nrm add <registry> <url>

```

### 删除源

```
$ nrm del <registry>
```