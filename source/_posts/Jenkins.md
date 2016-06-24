title: 使用 Jenkins 部署 gulp 构建的静态项目
tags: [jenkins]
categories: []
date: 2016-06-23 14:13:00
---
[Jenkins](https://jenkins.io/)是一个用java编写的持续集成工具，你可以通过它快速的部署你的项目，从源码管理软件(svn, git)上拉去源代码，编译代码生成发布资源，上传到远端服务器，在远端服务器上执行发布脚本。

他有着丰富的插件，你可以从[插件列表](https://wiki.jenkins-ci.org/display/JENKINS/Plugins)中找到你需要的插件。
<!-- more -->

### 构建环境
- `os`: mac osx 10.11.5
- `Jenkins`: version 1.651.3

### 安装Jenkins
可以在[这里](https://jenkins.io/)下载到Jenkins，下载安装之后，Jenkins会默认启动并监听本地的`8080`端口，打开`http://localhost:8080`你可以看到如下页面。
![Alt text](./1466667153678.png)

接下来我们主要用到的就是导航栏里的`新建`和`系统管理` 

### 安装插件
![Alt text](./1466669693808.png)
在系统管理 --> 管理插件 中 可以找到你需要的插件
本文使用的插件为: 
- [Publish Over SSH Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over+SSH+Plugin)

### 新建任务
点击导航栏中的`新建`可以看到如下截图：
![Alt text](./1466669949320.png)
输入你自定义的项目名称，此处我们选择 `构建一个自由风格的软件项目`

### 配置Git
进入到你的任务配置项，可以看到 `源码管理`一栏，在这里勾选`Git`如果找不到，你需要在 `管理插件`中添加`Git Plugin`插件。

`Git`配置项截图如下:
![Alt text](./1466671261512.png)

在`Repository URL`一项中输入你的git仓库地址,如果使用的是 ssh地址，那么可能会报错,原因是jenkins在启动任务时，会使用一个临时账户`jenkins`，而这个账户时没有配置ssh-key的，你需要切换到该账户，按照[配置ssh](https://help.github.com/articles/generating-an-ssh-key/) 方法将你的`ssh key`添加到当前账户。
```
##切换账户
sudo su jenkins
```
关于ssh登录的介绍可以参考[这里](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)

切换到`jenkins`账户之后，你拉下来的git仓库保存在本地的如下目录中:
```
~/Home/jobs/任务名称/workspace
```

### 执行 gulp 构建命令
`Jenkins`默认提供了一些构建步骤
![Alt text](./1466672002202.png)
可以执行 `shell 脚本` 和 `dos 命令`，因为这些命令是在一个`jenkins`账户下执行的，所以你的**node**和**npm**的环境变量可能需要额外设置，此处我们直接在命令行中设置环境变量，在出来的Command输入框中输入如下
```
#!/bin/zsh
export PATH="your/node/path:your/global/node_module/path:PATH"
npm install && gulp build
```
上面将node和npm的安装目录以及全局安装的node模块的目录添加进了系统的环境变量中，并且执行了构建命令生成了要发布的资源，接下来我们只需要将资源发布到目标服务器


### 配置Publish Over SSH
[`Publish Over SSH`](https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over+SSH+Plugin)插件可以让你通过ssh连接服务器并且上传文件，上传完文件之后可以在服务器端执行脚本。

使用该插件首先需要添加你的远端服务器，打开jenkins首页分别进入如下图标记的位置
![Alt text](./1466592561793.png)

在系统设置相中找到`SSH Server`：
![Alt text](./1466592681527.png)

`Passphrase`:  登录密码，可以是ssh登录密码，也可以是账户密码，截图处使用的是账户密码
`Path to key`:  你也可以指定一个ssh key存放的路径(~/.ssh/id_rsa.pub)
`key`: 直接输入公钥值

以上是公共配置，在在添加的`SSH Servers`没有配置的情况下将会使用上面的配置。
`SSH Servers`： 为你需要连接的服务器配置。

- `Name`： 服务器别名，在任务的配置项中将会以该别名显示服务器
- `Hostname`: 服务器ip地址
- `Username`: 登录到远端服务器的 帐号名 (如：root)
- `Remote Directory`： 登录之后你的当前目录

设置完服务器保存后，回到你的新建任务配置项，你就可以看到刚才添加的服务器了

![Alt text](./1466593401737.png)
![Alt text](./1466593433014.png)

-  `Source file`： 为你要上传的文件，可以使用[shell 匹配语法](http://wiki.bash-hackers.org/syntax/pattern)匹配你需要的文件
- `Remove prefix`: 文件路径的修正，比如你的`Source file`填的是`foo/bar/distfile.js`,这里填写`foo/bar`，那么上传的文件就不会在目标服务器上新建`foo/bar`这个路径。
- `Remote directory`： 你要上传文件相对于服务器配置项中的路径的 相对路径
- `Exec command`: 上传文件之后需要执行的脚本

配置好上述选项之后我们的jenkins任务就可以执行了，你可以在`Console Output`中看到任务执行各个具体过程中的日志