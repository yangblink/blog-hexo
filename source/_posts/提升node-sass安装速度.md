title: 提升node-sass安装速度
date: 2017-08-09 18:33:21
tags:
  - node-sass
---

## 为什么很慢？
使用npm安装`node-sass`的时候会从github上下载一个二进制文件，由于[GFW](https://baike.baidu.com/item/great%20firewall/4843556?fr=aladdin&fromid=18582731&fromtitle=GFW)的原因下载速度会比较慢，可通过先缓存该二进制文件`(通过其它方式先下载好)`解决，node-sass官方提供了[解决方案](https://github.com/sass/node-sass#binary-configuration-parameters)



## 找到自己操作系统对应的二进制文件

使用如下命令获取当前系统名，在[列表页](https://github.com/sass/node-sass/releases)获取对应的二进制文件
```bash
node -p "[process.platform, process.arch, process.versions.modules].join('-')"
```
本地新建一个目录(这个目录不能被修改删除，因为之后的安装会从这个目录下找下载的二进制文件)，这里我们假设目录为`/local/binary/sass-binary/binary.node`

设置系统环境变量:
```bash
export SASS_BINARY_PATH=/local/binary/sass-binary/binary.node
```

之后就可以安装`node-sass`了,在日志中可以看到该二进制文件从本地缓存中找到
```bash
npm install node-sass
```

## 环境变量持续生效
上面的 export 命令只是在当前的终端中设置了`SASS_BINARY_PATH`变量，如果重新打开终端或者重启电脑这个环境变量就失效了，如果你用的 zsh  或  bash 在家目录`(~)`的 `.zshrc` 或 `.bashrc`下将
```bash
export SASS_BINARY_PATH=/local/binary/sass-binary/binary.node
```
添加进去，并执行 
```bash
## 只是添加了上面的那一句并不会去执行那条命令  用如下命令让.zshrc .bashrc 重新执行一遍
source .
```