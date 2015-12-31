title: Wix 学习
date: 2015-12-23 09:42:12
tags: wix
---
最近在学习[Wix toolset](http://wixtoolset.org/) (版本3.10)，阅读了官网的[文档](http://wixtoolset.org/documentation/manual/v3/)和[教程](https://www.firegiant.com/wix/tutorial/)，记录下所学和遇到的一些问题。

<!-- more -->
`Wix`可以通过配置xml格式的文件`.wxs`生成`.msi`安装包，下载之后将安装目录下的`bin`文件夹添加到系统的环境变量下，这样我们就可以在cmd里面使用Wix的命令行了，打包主要用到的命令行是`candle.exe`和`light.exe`。

`candle.exe`将目标`*.wxs`转换成`light.exe`可识别的`*.wixobj`文件。
`light.exe`则是生成最终`*.msi`的工具。

## 开始使用Wix

可以从[教程](https://www.firegiant.com/wix/tutorial/getting-started/putting-it-to-use/)中下载到一个最简单的[例子](https://www.firegiant.com/system/files/samples/SampleFirst.zip)，这个例子没有引导界面，直接将程序安装好，程序中需要替换`GUID`为自定义的ID，打包成`.msi`只需要执行
```
candle.exe SampleFirst.wxs
light.exe SampleFirst.wixobj
```

## 使用Wix自带的引导界面
要使用Wix自带的引导界面需要在`light.exe`命令后时添加选项`-ext WixUIExtension`
```
candle.exe SampleWixUI.wxs
light.exe -ext WixUIExtension SampleWixUI.wixobj
```
同时在`.wxs`中添加
```
<UIRef Id="WixUI_Mondo" />
```
Id为`Wix Extension`提供的5中引导界面之一
- WixUI_Mondo
- WixUI_FeatureTree
- WixUI_InstallDir
- WixUI_Minimal
- WixUI_Advanced

详情可参考[教程](https://www.firegiant.com/wix/tutorial/user-interface/ui-wizardry/)


## 引导界面使用中文
在`Product`和`Package`标签中有`Language`,`Codepage`,`Languages`和`SummaryCodepage`属性，可以根据微软的[语言列表](https://msdn.microsoft.com/en-us/library/Aa369771.aspx)查到需要用到的语言所对应的Id，`LANGID`对应`Language`和`Languages`，`ASCII code page`对应`Codepage`和`SummaryCodepage`。
> 在修改完ID之后，打包时需要添加命令`-cultures:zh-CN`，不同语言对应的code参考[这里](http://wixtoolset.org/documentation/manual/v3/wixui/wixui_localization.html)，否则语言修改将不会生效。

## 自定义引导界面
Wix只提供了5中固定格式的引导界面，所以有时候我们需要自己订制界面，可以参考教程中提供的这个[例子](https://www.firegiant.com/wix/tutorial/user-interface/new-link-in-the-chain/),这是一个增加引导界面流程的例子。


Wix扩展的这些所有界面的配置文件我们可以在安装目录下的`\SDK\wixui`中找到对应`.wxs`文件。

通过观察这些文件我们可以发现`Wix`扩展的这些引导界面是通过如下方法来控制界面跳转的
```
<Publish Dialog="LicenseAgreementDlg" Control="Back" Event="NewDialog" Value="WelcomeDlg">1</Publish>
<Publish Dialog="LicenseAgreementDlg" Control="Next" Event="NewDialog" Value="InstallDirDlg">LicenseAccepted = "1"</Publish>
```
通过`Control`的`Next`和`Back`属性表示用户操作的时间，来控制对应的事件。

如果我们需要删除协议许可窗口可以将对应组件的引导界面的`.wxs`(`\SDK\wixui`目录中)复制到自己的当前项目中，并修改`<UI Id="你自己的ID">`UI标签的ID为自定义标签，命名为`YOU_WXS.wxs`(此处自己命名)，然后将`LicenseAgreementDlg`对应的部分删除比替换有关`LicenseAgreementDlg`窗口的跳转。打包的命令为
```
candle.exe SampleFirst.wxs YOU_WXS.wxs
light.exe -ext WixUIExtension SampleFirst.wixobj YOU_WXS.wixobj 
```
详情可以参考[教程](http://wixtoolset.org/documentation/manual/v3/wixui/wixui_customizations.html)。
