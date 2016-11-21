title: 使用Gitlab-Runner Docker 构建 node 项目
tags: []
categories: []
date: 2016-11-21 10:25:00
---

在我们编写好了源代码之后，我们需要编译，打包，发布到服务器，我们的软件才可以使用。持续集成就是指的这一系列的操作，本文将介绍[gitlab-ci](https://about.gitlab.com/gitlab-ci/)它基于`gitlab`
<!-- more -->

##  Gitlab-CI介绍

[Gitlab-CI](https://docs.gitlab.com/ce/ci/quick_start/README.html)是Gitlab官方提供的持续集成服务，在仓库的根目录下新建`.gitlab-ci.yml`文件，并且在`gitlab`中配置`runner`，在之后的每次提交合并中将会触发[构建](https://docs.gitlab.com/ce/ci/pipelines.html)


## 安装Gitlab Runner
这是官方安装[文档](https://docs.gitlab.com/runner/install/)，由于墙的原因，`yum apt-get`等可切换到国内镜像，或使用`vpn shaodowsocks`

安装完之后会有两个命令`gitlab-ci-multi-runner`和`gitlab-runner`，本文只构建一个`runner`作为例子，使用`gitlab-runner`为例


## 配置Gitlab Runner
要在`gitlab`中添加一个runner，只需要执行
```bash
## 注册runner  会以引导的方式询问相关参数的设置
gitlab-runner register
```
`runner`可以设置多个`executor`
- shell
- docker
- docker-ssh
- ssh

本文以node项目为例(其他项目同理),要构建一个node项目需要一台装有`node`并且需要`npm`使用国内镜像，甚至需要全局安装一些包(如：gulp,webpack)，这时候如果有一个已经安装好环境的`docker`镜像将可以快速的在一台机器上部署,本文使用`docker`形式注册`runner`

```bash
$ sudo gitlab-runner register

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
## 输入你的gitlab地址  
Please enter the gitlab-ci token for this runner
## gitlab的token(在gitlab的Admin Area中) 或者仓库的token(仓库->设置->Runner)
Please enter the gitlab-ci description for this runner
## Runner描述信息
Please enter the gitlab-ci tags for this runner (comma separated):
## Runner的标签 可以指定仓库 只使用固定标签的Runner构建
Please enter the executor: parallels, shell, ssh, virtualbox, docker+machine, docker-ssh+machine, docker, docker-ssh, kubernetes:
docker  ## 这里我们选择docker
Please enter the Docker image (eg. ruby:2.1):
your-image  ##拥有你的编译环境的镜像
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```
执行成功之后你可以通过`gitlab-runner list`查看到你注册的runner，可以看到每一个runner的配置信息都可以在`ConfigFile`中看到(`/mypath/.gitlab-runner/config.toml`)
```bash
## 查看已经注册的runner
$ gitlab-runner list

Listing configured runners                          ConfigFile=/mypath/.gitlab-runner/config.toml
```
注册成功之后就可以在gitlab的页面上看到你的Runner了

![](http://upload-images.jianshu.io/upload_images/670502-38d69f400bf4ebc7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

type有两种
- shared 所有仓库都可以使用
- specific  只有指定的仓库可以使用

type的类型由执行 `gitlab-runner register`命令填入的`token`决定

>  有时候runner会连接不上，或者在仓库->设置->runner里呈灰色，这有可能是runner机器上没有启动`gitlab-runner run`引起的，可以执行`ps -ef | grep gitlab`看看是否存在`gitlab-runner run`的进程，如果没有则执行`gitlab-runner run &`该命令会启动`runner`服务，从gitlab拉去的代码将被放在执行目录下

## 配置`.gitlab-ci.yml`

```bash
##你在register中使用的镜像名
image: my-node-image
##缓存 node_modules/目录 下次构建不会删除
cache:
  paths:
  - node_modules/
## 任务名称 构建命令
all_tests:
  script:
   - pwd
   - npm install
   - gulp
   - scp -r ./file  xxx@192.x.x.14:/dist/path
```
上述命令在runner执行的时候会去仓库拉去镜像，如果镜像找不到则使用本地的，所以确保runner的机器有相关镜像
命令我们看到了`scp`，但是命令实际是运行在docker中的，所以scp会失败，这时候我们需要添加`ssh`验证，可以参考[gitlab-runner ssh配置](https://docs.gitlab.com/ee/ci/ssh_keys/README.html)

只需要在仓库的设置中添加参数`SSH_PRIVATE_KEY`值为`ssh`的密钥即可

![](http://upload-images.jianshu.io/upload_images/670502-8c8b00a19d641d73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


上述脚本应该变为如下
```bash
## 写入密钥 并配置 ~/.ssh/config 文件
before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && echo -e "Host *\\n\\tStrictHostKeyChecking no\\n\\n" > ~/.ssh/config'
##你在register中使用的镜像名
image: my-node-image
##缓存 node_modules/目录 下次构建不会删除
cache:
  paths:
  - node_modules/
## 任务名称 构建命令
all_tests:
  script:
   - pwd
   - npm install
   - gulp
   - scp -r ./dist  xxx@192.168.1.1:/publick/path
```

至此我们构建好了一个`runner`，它会在每次仓库有新的提交时执行 `gulp`构建，并把构建好的`/dist`目录拷贝到`192.168.1.1`的`/publick/path`中


`.gitlab-ci.yml`还有很多配置，可以指定有哪些分支变动或者标签时才会去构建，可以参考[.gitlab-ci.yma配置](https://docs.gitlab.com/ce/ci/yaml/README.html)