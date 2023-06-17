---
title: JavaScript异步解决方案发展历程
date: 2020-06-18
tags:
  - JavaScript
author: qinghuanI
location: wuhan
---

JavaScript 单线程的特点带来的问题是只要有一个任务耗时很长，后面的任务都必须要排队等待，会拖延整个程序的运行。常见的浏览器页面卡死，往往就是因为一段 JavaScript 代码长时间运行 (比如死循环)，导致整个页面卡在这个地方，其它任务无法执行。 为了解决这个问题，JavaScript 将任务分为同步（sync）和异步（async）。

异步模式中，每一个任务有一个或多个回调函数（callback），前一个任务结束后，不是执行后一个任务而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序执行顺序与任务执行顺序是不一致的、异步的。

异步模式非常重要。在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是 Ajax 操作。在服务器端，” 异步模式” 甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有 http 请求，服务器性能会急剧下降，很快就会失去响应。

## 回调函数

```js
function doThing(callback) {
  if (condition) {
    callback();
  }
}
```

在早期的 JavaScript 语言中，实现异步的主要方式就是回调函数，回调函数实现异步的方式简单明了

## 事件监听

除回调函数外，另一个实现异步的方式就是事件监听，当事件触发时，就会执行绑定事件的方法

```js
document.addEventListener("load", callback);
```

## Promise

Promise 是 ES6 新增的一个状态机容器，用来优雅解决 JS 异步的问题

HTML5 的 fetch 方法基于 Promise 实现

```js
fetch(url)
  .then((users) => {
    //
  })
  .catch((err) => {
    console.error(err);
  });
```

使用 `.catch` 方法捕获 Promise 产生的错误

## Generator

Generator 函数是 ES6 提供的一种异步编程解决方案，整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明

## async/await

async/await 是异步的终极解决方案。它将异步的代码彻底以同步的代码形式表示

下面使用 async/await 改写 Promise 中的例子

```js
try {
  const response = await fetch(url).then((res) => res.json());
} catch (e) {
  console.error(e);
}
```

async/await 以同步的形式执行代码，所以会阻塞后面的代码，另外使用 `try...catch...`捕获错误
