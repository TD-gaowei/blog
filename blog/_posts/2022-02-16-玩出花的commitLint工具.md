---
title: 玩出花的commitLint工具
date: 2022-02-16
tags:
  - 前端工程化
  - commitlint
author: qinghuanI
location: wuhan
---

什么是 commitlint?

commitlint 检查您的提交消息是否符合常规的提交格式

一般来说，模式大多是这样的：

```text
type(scope?): subject  #scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")
```

项目中的例子是这样的

```text
chore: run tests on travis ci
```

```text
fix(server): send cors headers
```

```text
feat(blog): add comment section
```

根据 commitlint-config-conventional（基于 Angular 约定）的常见类型可以是：

- build：影响构建系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）
- chore：不修改 src 或测试文件的其他更改
- ci：更改我们的 CI 配置文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）
- docs：文档仅更改
- feat：添加新功能
- fix：错误修复
- perf：提高性能的代码更改
- refactor：既不修复错误也不添加功能的代码更改
- revert：还原以前的提交
- style：不影响代码含义的更改（空格、格式、缺少分号等）
- test：添加缺少的测试或更正现有测试
- release：发布新版本
- workflow：工作流相关的文件修改

## 安装 commitlint

项目中的终端下执行下面的命令

```shell
npm install --save-dev @commitlint/{config-conventional,cli}
```

接着在项目的根目录下，添加 commitlint.config.js 配置文件

```shell
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

详细的配置文件如下

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "release",
        "workflow",
      ],
    ],
    "type-case": [2, "never"],
    "type-empty": [2, "never"],
    "subject-full-stop": [2, "never"],
  },
};
```

按照上面的配置后，测试结果如下：
