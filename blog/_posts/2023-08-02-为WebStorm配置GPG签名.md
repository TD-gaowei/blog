---
title: 为 WebStorm配置 GPG 签名
date: 2023-08-02
tags:
  - WebStorm
author: qinghuanI
location: wuhan
---

## 引言

GPG 签名是对代码提交者进行身份验证的一种补充，即证明代码提交来密钥持有者，理论上可以确保在目前的破译技术水平下无法篡改内容。您可以使用 GPG 工具 (GNU Privacy Guard) 生成密钥，对 Git 仓库中所做的提交进行签名

Gitea 服务器在检查代码签名时利用用户提供的 GPG 公钥验证代码提交者的身份。如果希望强制启用签名，您可以为您的项目配置分支保护规则，拒绝未使用 GPG 签名的提交，或拒绝来自未验证用户的提交

## 生成 GPG 密钥

## 列出公钥

使用 `gpg -k` 或 `--list-public-keys` 查看公钥，参数后面没有指定公钥，则输出所有公钥

```shell
gpg -k #or gpg --list-public-keys
```

## 列出私钥

使用 `gpg -K` 或 `--list-secret-keys` 查看私钥，参数后面没有指定私钥，则输出所有私钥

```shell
gpg -K # or gpg --list-secret-keys
```

其结果如下：

## 导出私钥/公钥

使用私钥导出公钥

在终端中使用列出私钥

```shell
gpg -K
```

成功执行后，结果如下

## 删除私钥/公钥

## 配置到 GitHub

点击 GitHub 个人头像，按照 `Settings->SSH and GPG Keys` 操作

## 更改 `.zshrc` 配置

需要在 .zshrc 文件中配置下面的命令

```textmate
export GPG_TTY=$(tty)
```

## 在 WebStorm 中配置 GPG

在 WebStorm 中，使用 `command + ,` 快捷键，按照`版本控制-> Git`打开详细面板

![GPG Settings](./images/202308/gpg_settings.png)

点击 `配置 GPG 密钥...` 按钮，打开配置 GPG 密钥

![GPG Keys](./images/202308/gpg_keys.png)

通过下拉框，选择可用的 GPG 密钥

## FAQ

常用的测试操作

```shell
echo "test" | gpg --clearsign
```
