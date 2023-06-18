---
title: 解读 classnames 源码
date: 2019-10-11
tags:
  - classnames
author: qinghuanI
location: wuhan
---

## 介绍

classnames 库通过 JavaScript 动态控制标签的类名。常用于 react 项目里，用来控制组件的类名。
它有如下的优点:

- **避免在组件里写行内样式**
- **配置性高，比如通过对象动态配置类名**

## 使用方式

我推荐下列使用方式。

```js
// 这是最常见的用法
classNames("foo", "bar"); // => 'foo bar'
// 通过变量控制每个类名。visible 为 false,则结果为 'foo', 为 true,则结果为 'foo bar'
classNames("foo", { bar: visible }); // => 'foo bar'

// 比如在 Tag 组件里，控制 Tag 的状态的类名可以写成下列形式，但 type 必须有默认值,比如默认 default
classNames("tag", `is-${type}`); // => 'tag is-default'
// type 无默认值, 不推荐
classNames("tag", `is-${type}`); // => 'tag is-undefined'

// 为 false 的值会被过滤掉
classNames(null, false, "bar", undefined, 0, 1, { baz: null }, ""); // => 'bar 1'
```

## 源码分析

我们可以在 github 上找到 [classnames](https://github.com/JedWatson/classnames/blob/master/index.js) 的源码。
classnames 的代码很少，仅仅只有 51 行。下面，我们来逐行分析代码。

```js
(function () {
  "use strict";

  //...
})();
```

这是 [IIFE \(立即调用函数表达式\)](https://developer.mozilla.org/zh-CN/docs/Glossary/%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F)，使用 IIFE 可以做到作用域隔离。

```js
var hasOwn = {}.hasOwnProperty;
```

将 Object 类型原型对象上的 hasOwnProperty 方法存入变量中，方便之后使用 hasOwnProperty 方法时，不用顺着原型链查找该方法，提高性能。

接下来，便是 classnames 库的核心代码，classNames 方法，同时也是 classnames 库唯一的 API。

```js
function classNames() {
  var classes = [];

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    /*
            如果传入的值有 null、 undefined、 ""、false、NaN 
            等值直接跳过本次循环，进行下一次循环
        */
    if (!arg) continue;

    var argType = typeof arg;
    /*
            classNames 真正处理四类数据，分别为字符串、数值、数组和对象
        */
    /*
        如果传入的参数是字符串或数值类型，直接添加到最终的结果里。
        eg。 classNames('foo', 1) => "foo 1"
       */
    if (argType === "string" || argType === "number") {
      classes.push(arg);
      /*
            如果传入的是数组类型，就递归遍历数组
        */
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        var inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
      /*
            如果传入的参数是对象类型。则分为两种情况:
            1. 对象没有 toString 属性；
            classNames({foo: true}) => "foo"
            2. 对象有 toString 属性；
            classNames({"foo": toString: 'bar'}) => "bar"
            */
    } else if (argType === "object") {
      if (arg.toString !== Object.prototype.toString) {
        classes.push(arg.toString());
      } else {
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      }
    }
  }

  return classes.join(" ");
}
```

梳理一下整个流程。

1. 声明一个空数组变量 classes，最后将 classes 里所有元素以空格符分隔组成字符串;
2. 使用 for 循环对传入 classNames 方法的参数迭代;
3. 若传入的参数经过隐式转换为 false,则将其过滤，结束本次循环，进行下一次循环;
4. 参数为字符串或数值类型，则将其参数添加到 classes 数组中;
5. 参数为数组类型，则进行递归处理，继续从步骤 1 开始，直至最后将返回值 inner(一维数组)添加到 classes 数组中;
6. 参数如果为对象类型，对象的属性值中没有 toString 时，直接根据属性值的 true/false 判断该属性是否成为其类名，如果有 toString,它的值作为其类名。

但是目前广泛使用的最新的 classnames v2.2.6 版本中。

```js
// classnames v2.2.6
// ...
else if (argType === 'object') {
    for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
        }
    }
}
// ...
```

**注意**：对参数为对象类型的情况只做了简单处理，只要对象属性的属性值为 true,即将该属性追加到 classes 数组中。

最后，我们来看看 classNames 定义的模块导出部分源码。

```js
if (typeof module !== "undefined" && module.exports) {
  /*
        commonJS 规范
    */
  classNames.default = classNames;
  module.exports = classNames;
} else if (
  /*
        amd 规范
    */
  typeof define === "function" &&
  typeof define.amd === "object" &&
  define.amd
) {
  define("classnames", [], function () {
    return classNames;
  });
} else {
  /*
        直接暴露到全局
        默认为 browser 环境
    */
  window.classNames = classNames;
}
```

classnames 使用了 UMD 模块导出规范。

1. 先判断是否存在 module 对象，如果存在，即在 Node.js 环境中，遵循 commonJS 规范导出;
2. 如果存在 define 方法，即为浏览器环境中，遵循 AMD 规范导出;
3. 如果 module 和 define 都不存在，直接将其暴露到全局环境(默认为浏览器环境)中，挂载到 window 全局对象上。

## 参考链接

- [classnames--react 中动态修改类名](https://zhuanlan.zhihu.com/p/45339681)
