title: 为browser-sync设置代理
author: yangblink
tags:
  - proxy
categories: []
date: 2016-09-17 07:21:00
---
我们在做前端开发的时候，经常会遇到程序已经就绪但是后端api接口还没好的这种情况，这极大的影响了效率。为了提高开发效率，本文将介绍一种自己搭建代理服务器的方法，如果你的项目使用[browser-sync](https://www.browsersync.io/)作为开发的**web serve**那么不妨看下接下来介绍的内容
<!-- more -->

## browser-sync
[browser-sync](https://www.browsersync.io/)是一个在前端开发中，可以监听文件的修改自动刷新浏览器的`web serve`开源应用，它基于[express](http://expressjs.com/zh-tw/)开发，在**express**中有一个中间件的概念，他把来自web的请求处理都放在了一个函数中：
```
function middleware(request, response, next){
	// request 表示web请求，里面存放了 http request的各种信息 
	// response 表示对这次请求的返回
	// next 表示调用下一个中间件，当response.end()时，将自动停止调用
}
```
**express**就是通过一个个的中间件来对每一个请求做处理并返回。
**browser-sync**的配置项中也有[middleware](https://www.browsersync.io/docs/options#option-middleware)，接下来介绍的代理方法就是通过他实现的。

## http-proxy-middleware
**node.js**的流行离不开**npm**，在[npm](http://npmjs.org/)上有着无数开发者贡献的扩展包，他们的源代码基本上都能在[github](http://github.com)上找到,避免重复造轮子也是提高开发效率的方法之一，当我们知道了上述的知识后，我们就可以打开[github](http://github.com)在其中搜索关键字`node`,`proxy`,`middleware`，然后按照`start`数排序，排在前面的基本上就是我们要找的了。

## 实战
接下来我们看一下[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)是如何在**browser-sync**中工作的
```javascript
var browserSync = require('browser-sync').create()
var proxy = require('http-proxy-middleware')
// 设置代理
var middleware = proxy('**', {target: 'https://api.github.com', changeOrigin: true,});
function Server() {
	var bs = browserSync.init({
		port: 3700,
		server: {
			directory: true,
			baseDir: ['./']
		},
		middleware: [middleware]
	})
}
Server();
```
直接运行你会看到[https://api.github.com](https://api.github.com)返回的内容，此时代理已经成功。

有时，我们在开发的过程中可能会遇到更复杂的情况，比如接口**a1**要代理到**api A**接口**a2**要代理到**api B**，这种情况也可以通过配置[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)解决，我们看下例子：
```javascript
var browserSync = require('browser-sync').create()
var proxy = require('http-proxy-middleware')
var proxyTable = {
	'/test': 'http://localhost:6000',
}
// 设置代理
var middleware = proxy('**', {
	target: 'https://api.github.com',
	changeOrigin: true,
	logLevel: 'debug',
	pathRewrite: {
        '^/test/testa' : '/apiA',
        '^/test/testb' : '/apiB'
    },
	router: proxyTable,
});

function Server() {
	var bs = browserSync.init({
		port: 3700,
		server: {
			directory: true,
			baseDir: ['./'],
		},
		open: false,
		middleware: [middleware],
	})
}
Server();
```
通过配置**pathRewrite**和**router**，我们可以访问`localhost:3700/test/testa` 它将会代理到`http://localhost:6000/apiA`
以上是一些可能常用的选项如果希望了解更多可以参考[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)。

通过代理我们还可以结合[rap](http://rap.taobao.org/org/index.do)搭建一个前端的mock server。有兴趣的同学可以研究一下。