title: 搭建shadowsocks服务
date: 2017-08-10 07:50:31
tags:
  - shadowsocks
---

首先你需要一个vps，这里推荐使用 `centos6`因为这方便安装`锐速`

我是用的是[vultr](http://www.vultr.com/?ref=6898646)，有日本、美国、新加坡等地的机房，截止2016-12-28日可以`5$`购买最便宜配置的机器，绑卡另送`5$`。

选择好机器(centos6 x64)后就可以终端登录了
```bash
## 密码在后台获取
ssh root@你在vultr后台的ip
```
默认你的服务器是开着防火墙的，这意味着外网将无法访问你服务器的端口，可以通过**iptables**设置白名单，为方便起见我们直接关闭防火墙
```bash
service iptables stop
```

根据[shadowsocks](https://github.com/shadowsocks/shadowsocks/wiki/Shadowsocks-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)文档安装shadowsocks
```bash
yum install python-setuptools && easy_install pip
pip install shadowsocks
## 执行之后你将会有 ssserver 的命令 可以通过-h 查看如何使用
## ssserver -h
```

新建配置文件`ss.json`
```javascript
// ss.json
{
    "server":你的ip,
    "server_port":8388,
    "local_address": 你的ip,
    "local_port":1080,
    "password":"你的密码",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```

启动`shadowsocks`服务
```bash
## 后台启动
ssserver -c ss.json --user nobody -d start
## 如果要测试链接看日志则直接
ssserver -c ss.json
```

到此我们的服务就搭建好了，接下来就可以在`shadowsocks`客户端里添加你的服务器了

## 服务加速

基本上很多国外的VPS都是高延迟搞丢包，默认的tcp算法并不适应这种场景，我们需要安装加速软件使用适合这种场景的tcp算法。

我用过[bbr](https://github.com/google/bbr) 和 锐速，前者开源但是效果还是 锐速好，这里介绍锐速的安装。

提供几个bbr的文章
http://www.jianshu.com/p/3714f3a74698
https://blog.kuoruan.com/115.html

## 安装锐速破解版
```bash
wget -q -O- http://file.idc.wiki/get.php?serverSpeeder | bash
bash serverSpeeder_setup.sh
```
如果你是centos6 上面的命令将会安装成功，centos7会有问题。

## 生成ss二维码
可以参考http://shadowsocks.org/en/config/quick-guide.html
` ss://method[-auth]:password@hostname:port`
原理就是将上述`ss://`之后的部分转换为base64编码并生成二维码，`[-auth]`可以不填
