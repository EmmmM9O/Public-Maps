同时保留了电力系统 给玩家运营
遇到炮台未放置到情况请/sync
- 编译

```
yarn install
yarn run build
```
删除src/Maps/TD2/main.js前面两行import
然后将libs/AimUi.js内容插入到src/Maps/TD2/main.js前面
- 个人运行
加载地图 然后直接用控制台执行js脚步 
开多人游戏无效
>比如 New Console Mod
> 目前在开发个人用mod
- 多人游玩
参照服务器游玩
同时加入claj服务端mod(我魔改的不知道放哪里了) 获得claj link
- 服务器运行
加载地图后运行 Vars.mods.scripts.runConsole(new Fi("路径).readString())
