---
title: 使用Web Worker优化轮询
date: 2023-01-22
tags:
  - Web API
author: qinghuanI
location: wuhan
---

## 前言

在我们的日常工作中，我们经常遇到客户端实时获取服务端最新数据的业务场景，比如聊天系统、股票系统等等。在实现这些需求的时候，我们的技术方案有很多

如果只需要服务端向客户端推送最新数据，可以使用轻量级的服务器事件推送(Sever-Sent Events, 简称 SSE) 方法。如果客户端要向服务端发送数据，那么可以选择 WebSocket 方案。但是最简单的方案是客户端使用 Ajax 采用轮询的方式从服务端获取最新数据

客户端轮询是客户端定时向服务端发送 Ajax 请求，服务端接收到客户端的请求并响应，由于客户端频繁发送 Ajax 请求, 会浪费大量带宽和损耗服务器的性能，并且影响客户端 UI 的显示。所以在项目中，通常情况下采用 WebSocket 或 SSE 方案实现数据实时推送的需求

本篇文章旨在客户端必须使用轮询的前提下，通过 Web Worker 优化轮询性能，提升客户端页面流畅性

## Web Worker

Web Worker 使得一个 Web 应用程序可以在与主线程分离的后台线程中运行一个脚本操作。这样做的好处是可以在一个单独的线程中执行费时的处理任务，从而允许主（通常是 UI）线程运行而不被阻塞。

它的作用就是给 JS 创造多线程运行环境，允许主线程创建 worker 线程，分配任务给后者，主线程运行的同时 worker 线程也在运行，相互不干扰，在 worker 线程运行结束后把结果返回给主线程。这样做的好处是主线程可以把计算密集型或高延迟的任务交给 worker 线程执行，这样主线程就会变得轻松，不会被阻塞或拖慢。这并不意味着 JS 语言本身支持了多线程能力，而是浏览器作为宿主环境提供了 JS 一个多线程运行的环境。

## 示例

使用 vite 搭建一个 React 项目

```shell
yarn create vite polling --template react-ts
```

下面添加 worker.ts 文件，并在 worker.ts 里实现 Ajax 请求

```tsx
// worker.ts

async function fetchUsers() {
  // 伪代码
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      self.postMessage(res);
    })
    .catch((err) => {
      console.error("failed to fetch users", err);
    });
}

globalThis.setInterval(fetchUsers, 1000);
```

创建一个 `Polling` 组件，并引入上面创建的 worker.ts 文件

```tsx
// Polling.tsx

import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import UserWorker from "./worker.ts?worker"; // <--- 注意 vite 项目中引用 worker 文件的方式

const Polling = (): ReactElement => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userWorker = new UserWorker();

    function onMessage(payload: MessageEvent): void {
      setUsers(payload.data);
    }

    userWorker.addEventListener("message", onMessage);

    return () => {
      userWorker.removeEventListener("message", onMessage);
      userWorker.terminate();
    };
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user}>{user}</li>
      ))}
    </ul>
  );
};

export default Polling;
```

在 `useEffect` 里监听 Worker 的 `message` 事件，从而实时获取最新数据

> 当组件销毁时，一定要清理掉创建的 Worker，避免内存泄露

## 总结

对于客户端实时获取服务端最新数据的业务场景，笔者还是推荐优先使用 WebSocket 或 SSE 方案实现，但在 Web Worker 里使用轮询不失为一种性能比较好的方案
