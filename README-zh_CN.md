# create-ektfe-cli-app

## 运行

本地可以通过运行以下任意命令开启项目初始化。

```bash
npm init ektfe-cli-app

yarn create ektfe-cli-app
```

## 说明

1.新项目标题叫什么？

例如：图表统计。

它最后会写在新创建的项目的 module/xxx.html 里的 `<title>这里显示</title>`

2.当前项目属于哪个平台的？

例如：say

顾名思义，选一个。如果选“其它”，就要自定义一个新的。例如项目里没有`gm`，但要新增，就可以先选择“其它”，会询问你新的平台名字。

3.新项目的英文名称叫什么？

用来修改 package.json 的 name ，并且会自动修改 module 目录下的 html 名称。同时会修改根目录的 data.json 的 PORT 。
