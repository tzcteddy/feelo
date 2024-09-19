---
title: Node.js 安装和使用指南
date: 2024-06-02 10:07:59
post: comments
enable: true
categories: 
- [前端开发手册, 前端新手村：环境配置轻松上手]
tags: 
- 开发手册
---
# macOS 中安装 Node.js

## 什么是 Node.js

`Node.js` 是一个基于 `Chrome V8` 引擎的 `JavaScript` 运行时环境。最早发布于 2009 年 5 月，由 `Ryan Dahl` 开发。它使用了一个事件驱动、非阻塞式 `I/O` 模型，让 `JavaScript` 运行在服务端的开发平台，能让 `JavaScript` 成为 `PHP`、`Python`、`Perl`、`Ruby` 等服务端语言的脚本语言。

## 下载 Node.js

> - [下载地址](https://nodejs.org/zh-cn/)

![](../../img/frontendGuide/node-mac-1.webp)

其中 `LTS` 表示长期维护版本，也更加推荐安装这个版本。

## 安装

1. 下载好安装包之后，双击后缀名为 `.pkg` 的安装包，会弹出以下的弹窗。弹窗中会提示欢迎语，然后提示 `Node.js` 和 `npm` 会安装到硬盘中的地址。

- `Node.js`：安装在硬盘中的 `/usr/local/bin/node` 目录。

- `npm`：安装在硬盘中的 `/usr/local/bin/npm` 目录。

这里注意和 `Windows` 区分一下，因为 `macOS` 是基于 `Unix` 开发而来的，所以它的目录结构和 `Linux` 类似，是在总的根目录 `/` 下存在子目录。
![](../../img/frontendGuide/node-mac-2.webp)
2. 点击**继续**，会提示软件的相关许可协议。

![](../../img/frontendGuide/node-mac-3.webp)

- 如果点击**打印**，而你的电脑也连接了打印机，那么这时候就能够将协议打印出来。

![](../../img/frontendGuide/node-mac-4.webp)


- 如果点击**存储**，此时会将协议保存为 `pdf`，由自己选择存放的路径。

![](../../img/frontendGuide/node-mac-5.webp)

3. 再次点击继续，会弹窗提示必须同意相关协议条款才能走下一步。

![](../../img/frontendGuide/node-mac-6.webp)

4. 选择软件安装的目的盘，一般来讲，`macOS` 中没有什么盘之分的，但如果你外接了硬盘，而你需要安装的软件也刚好要放在外接盘中，那么此时就可以选择另一个硬盘。

![](../../img/frontendGuide/node-mac-7.webp)
![](../../img/frontendGuide/node-mac-8.webp)

5. 下一步，此时会提示让输入电脑的密码来开始安装。

![](../../img/frontendGuide/node-mac-9.webp)

6. 安装成功，关闭安装窗口即可。

![](../../img/frontendGuide/node-mac-10.webp)

# Windows 安装 Node.js 图文教程

## 前言

本教程所有操作基于`Window 10`操作系统 + `Node.js v12.16.1-x64`，原则上适用于所有`Windows`操作系统，细节不同请根据自己需要自行判断。

## 下载

要安装`Node.js`，首先需要去下载对应系统安装包，[下载地址](https://nodejs.org/zh-cn/download/)；

![](../../img/frontendGuide/node-win-1.png)

##  安装

1. 双击下载好的安装包；

    ![](../../img/frontendGuide/node-win-2.png)

2. 直接下一步；

    ![](../../img/frontendGuide/node-win-3.png)

3. 勾选同意相关使用协议，同时下一步；

    ![](../../img/frontendGuide/node-win-4.png)

4. 修改成你要安装的路径（默认也可以），然后下一步；

    ![](../../img/frontendGuide/node-win-5.png)

5. 建议不作修改，直接下一步，当然你也可以对里边所需服务进行勾选；

    ![](../../img/frontendGuide/node-win-6.png)

6. 所需工具自己需要就勾选，不需要就直接下一步；

    ![](../../img/frontendGuide/node-win-7.png)

7. 直接安装，开始安装；

    ![](../../img/frontendGuide/node-win-8.png)

8. 完成安装后，点击 Finish 完成安装；

    ![](../../img/frontendGuide/node-win-9.png)

##  验证

安装后，我们怎样知道自己是否安装成功呢？可以使用如下命令查看，若成功则会返回下图类似结果；

```shell
node -v
```

![](../../img/frontendGuide/node-win-10.png)

## 环境变量配置

默认情况下，我们利用 `npm` 包管理器用来安装依赖包时，包会默认存放在 `C:\Users\用户名\AppData\Roaming\npm\node_modules` 目录下，如果你不确定你的包存放路径在哪儿，那么可以通过如下命令来进行查看：

```bash
npm root -g
```

但这样就存在一个问题，如果我们的依赖包很多的情况下，就会占用我们系统盘大量的空间，这时候我们如果不想让全局包放在这里，那么就可以自定义存放目录。修改的方式也很简单，只需要在控制台中执行如下两条命令即可：

```bash
npm config set prefix "D:\node\node_global"
```

```bash
npm config set cache "D:\node\node_cache"
```

当然，我们也可以打开配置文件 `.npmrc`，然后修改如下两条记录：

```xml
prefix = D:\node\node_global
cache = D:\node\node_cache
```

![](../../img/frontendGuide/node-win-11.png)

# nvm的安装和使用

## nvm是什么

nvm全英文也叫node.js version management，是一个nodejs的版本管理工具。nvm和n都是node.js版本管理工具，为了解决node.js各种版本存在不兼容现象可以通过它可以安装和切换不同版本的node.js。

## nvm下载

可在点此在[github](https://github.com/coreybutler/nvm-windows/releases) 上下载最新版本,本次下载安装的是windows版本。打开网址我们可以看到有两个版本：

+ nvm 1.1.7-setup.zip：安装版，推荐使用
+ nvm 1.1.7-noinstall.zip: 绿色免安装版，但使用时需进行配置。

## nvm安装

### windows安装
1. 卸载之前的node后安装nvm, nvm-setup.exe安装版，直接运行nvm-setup.exe
![](../../img/frontendGuide/nvm-1.png)

2. 选择nvm安装路径
![](../../img/frontendGuide/nvm-2.png)

3. 选择nodejs路径
![](../../img/frontendGuide/nvm-3.png)

4. 确认安装即可
![](../../img/frontendGuide/nvm-4.png)

5. 安装完确认
![](../../img/frontendGuide/nvm-5.png)

打开CMD，输入命令 nvm ，安装成功则如下显示。可以看到里面列出了各种命令，本节最后会列出这些命令的中文示意。

### mac安装
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# or

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash 
```

## nvm命令提示

> - nvm arch：显示node是运行在32位还是64位。
> - nvm install <version> [arch] ：安装node， version是特定版本也可以是最新稳定版本latest。可选参数arch指定安装32位还是64位版本，默认是系统位数。可以添加--insecure绕过远程服务器的SSL。
> - nvm list [available] ：显示已安装的列表。可选参数available，显示可安装的所有版本。list可简化为ls。
> - nvm on ：开启node.js版本管理。
> - nvm off ：关闭node.js版本管理。
> - nvm proxy [url] ：设置下载代理。不加可选参数url，显示当前代理。将url设置为none则移除代理。
> - nvm node_mirror [url] ：设置node镜像。默认是nodejs.org/dist/。如果不写u…
> - nvm npm_mirror [url] ：设置npm镜像。github.com/npm/cli/arc…
> - nvm uninstall <version> ：卸载指定版本node。
> - nvm use [version] [arch] ：使用制定版本node。可指定32/64位。
> - nvm root [path] ：设置存储不同版本node的目录。如果未设置，默认使用当前目录。
> - nvm version ：显示nvm版本。version可简化为v。

## 安装node.js版本

`nvm list available` 显示可下载版本的部分列表
![](../../img/frontendGuide/nvm-6.png)

`nvm install latest` 安装最新版本 ( 安装时可以在上面看到 node.js 、 npm 相应的版本号 ，不建议安装最新版本)
![](../../img/frontendGuide/nvm-7.png)

`nvm install` 版本号 安装指定的版本的nodejs
![](../../img/frontendGuide/nvm-8.png)

## 查看已安装版本

`nvm list`或 `nvm ls` 查看目前已经安装的版本 （ 当前版本号前面没有 * ， 此时还没有使用任何一个版本，这时使用 node.js 时会报错 ）
![](../../img/frontendGuide/nvm-9.png)

## 切换node版本

`nvm use` 版本号 使用指定版本的nodejs （ 这时会发现在启用的 node 版本前面有 * 标记，这时就可以使用 node.js ）
![](../../img/frontendGuide/nvm-10.png)