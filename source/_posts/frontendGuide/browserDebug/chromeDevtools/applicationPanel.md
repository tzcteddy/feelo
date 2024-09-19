---
title: Application面板
date: 2024-06-01 10:00:53
post: comments
enable: true
categories: 
- [前端开发手册, Debug 大作战：浏览器调试全攻略]
tags: 
- [浏览器调试, 谷歌开发者工具]
---

## 面板概览

> 使用 Application 面板可以检查、修改和调试 Web 应用的许多方面，包括其清单、Service Worker、存储和缓存数据。

Application（应用）面板分为四个部分，其中包含子菜单。

+ Application：包含有关应用的整体信息，包括其清单、Service Worker 和存储空间。
+ Storage 存储：查看和修改 Web 应用使用的不同存储方法。
  - 借助本地和会话存储列表，您可以选择来源并修改关联存储方法的键值对。
  - IndexedDB 列表包含数据库，可让您通过浏览器检查对象存储。
  - 通过 Cookie 列表，您可以选择来源并修改键值对。
  - 借助私密状态令牌和兴趣群体，您可以检查相应的令牌和群组（如果有）。
  - 通过共享存储空间列表，您可以选择源站，并检查和修改关联的键值对。
  - Cache storage 列表包含可用的缓存，可让您检查、过滤和删除其资源。
+ Background services： 检查、测试和调试后台服务。
+ Frames：将网页和资源划分为多个视图，并显示相关信息，例如安全与隔离、内容安全政策、API 可用性等。

![面板截图](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-1.png)


## 存储的查看、添加、修改和删除

> 以下以Cookie为例，其他localStorage、sessionStorage、IndexedDB、Web SQL等类似。
### 打开“Cookies”窗格
1. [打开 Chrome 开发者工具](https://developer.chrome.com/docs/devtools/open?hl=zh-cn)。
2. 依次打开 **Application** > **Storage** > **Cookies**，然后选择一个来源。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-2.png)

### 字段
**Cookies** 表包含以下字段：

- **名称**：Cookie 的名称。
- **值**。Cookie 的值。
- **网域**。获准接收 Cookie 的主机。
- **Path**。所请求网址中必须存在的网址才能发送 Cookie 标头。
- **到期时间 / Max-Age**。Cookie 的失效日期或最长存在时间。 对于[会话 Cookie](https://developer.mozilla.org/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie)，此值始终为 Session。
- **大小**。Cookie 的大小（以字节为单位）。
- **HttpOnly**。如果为 true，此字段表示 Cookie 应仅通过 HTTP 使用，并且不允许修改 JavaScript。
- **安全**。如果为 true，此字段表示只能通过安全的 HTTPS 连接将 Cookie 发送到服务器。
- **SameSite**。如果 Cookie 使用的是实验性 SameSite 属性，则包含 Strict 或 Lax。
- **分区键**。对于[处于独立分区状态的 Cookie](https://developer.chrome.com/docs/privacy-sandbox/chips?hl=zh-cn)，分区键是指在开始向设置 Cookie 的端点发出请求时，浏览器访问的顶级网址的网站。
- **优先级**。包含 Low、Medium（默认）或 High（如果使用的是已废弃的 [Cookie 优先级](https://bugs.chromium.org/p/chromium/issues/detail?id=232693)属性）。

要查看 Cookie 的值，请在表格中选中该 Cookie。如需查看未采用百分比编码的值，请勾选 check_box **显示已解码的网址**。
### 过滤 Cookie
使用**过滤**框按**名称**或**值**过滤 Cookie。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-3.png)

不支持按其他字段过滤。过滤条件不区分大小写。
### 添加 Cookie
要添加任意 Cookie，请执行以下操作：

1. 双击表格中的空行。
2. 输入**名称**和**值**，然后按 Enter 键。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-4.gif)

开发者工具会自动填充其他必填字段。您可以按照下文所述修改它们。
### 修改 Cookie
除了自动更新的 **Size**，其他所有字段都可修改。
双击某个字段即可进行修改。
![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-5.png)

开发者工具以红色突出显示[字段](https://developer.chrome.com/docs/devtools/application/cookies?hl=zh-cn#fields)值的 Cookie。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-6.png)

如需滤除有效的 Cookie，请选中顶部操作栏中的 check_box **仅显示存在问题的 Cookie**。
### 删除 Cookie
要删除 Cookie，请选择相应 Cookie，然后点击顶部操作栏中的 delete **删除所选项**。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-7.png)

点击 **全部清除**以删除所有 Cookie。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-8.png)

### 识别和检查第三方 Cookie
第三方 Cookie 是由与当前顶级网页不同的网站设置的 Cookie。第三方 Cookie 具有 SameSite=None 属性。
开发者工具会在**应用** > **存储** > **Cookie** 中列出此类 Cookie，并在它们旁边显示警告警告图标。将鼠标悬停在该图标上即可查看提示，点击该图标即可转到 **Issues** 面板了解详情。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-9.png)

您还可在[网络> 点击请求 >Cookie](https://developer.chrome.com/docs/devtools/network/reference?hl=zh-cn#cookies) 下找到第三方 Cookie。

![](../../img/frontendGuide/actualCombat/browserDebug/chrome-devtools-7-10.png)

**网络**面板会[突出显示存在问题的 Cookie](https://developer.chrome.com/docs/devtools/network/reference?hl=zh-cn#show-blocked-cookies)，并在受[第三方 Cookie 逐步淘汰](https://developer.chrome.com/privacy-sandbox/3pcd?hl=zh-cn)影响的 Cookie 旁边显示警告警告图标。
