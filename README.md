# picgo-plugin-wxcloud-uploader

为 [PicGo](https://github.com/Molunerfinn/PicGo) 开发的一款插件，新增了微信小程序云开发云存储

![截图](https://i.loli.net/2020/04/23/Lon8fIkSc9hz1GE.png)

## 安装

- 在线安装

    打开 [PicGo](https://github.com/Molunerfinn/PicGo) 详细窗口，选择**插件设置**，搜索**wxcloud-uploader**安装，然后重启应用即可。

- 离线安装
  克隆该项目，复制项目到 以下目录：
  - Windows: `%APPDATA%\picgo\`
  - Linux: `$XDG_CONFIG_HOME/picgo/` or `~/.config/picgo/`
  - macOS: `~/Library/Application\ Support/picgo/`

  切换到新目录执行 `npm install ./picgo-plugin-wxcloud-uploader`，然后重启应用即可。

## 配置

PS: 需要开通了云开发的小程序才可以使用哦，可以直接用小程序编辑器免费开通(每月5G流量 + 5G的存储)。

- appId: 微信小程序的appId
- appSecret: 微信小程序appSecret (公众号后台获取，[点我获取](https://mp.weixin.qq.com/wxamp/devprofile/get_profile))
- env: 云开发环境id (小程序开发IDE云开发控制台设置中获取)
- path: 文件存储路径 (不能用`/`开头，需要以`/`结尾)
