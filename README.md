## share components and utils

### INTRODUCE
你还在为多项目之间的共用组件编写npm包吗？试试git submodule
npm发布的circle涉及到编写，版本，打包，发布到公有/私有仓库;
使用者`npm install` 将npm包下载到`node\_modules`，或更新版本后重新`npm install`。
这种流程发布麻烦，更新慢，还涉及到私有仓库的配置，尤其是打包发布到npm之后，调试十分不方便。
git submodule方法虽不能解决所有这些问题，但可以减少上述开发流程中的一些环节。

各个模块的详细文档都在源代码的注释中。

### USAGE
如果你对git的子模块概念还不熟悉的话，请先阅读[git submodule](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)
clone it by git submodule
```
git submodule add http://git.jd.com/rmb-frontend/share.git
```
添加后，share文件夹存放在项目根目录中
在webpack配置`alias`中添加`share: resolvePath('./share/src')`

在项目中用相对路径引入即可
```
import AppStore from 'share/store/app'
```

很多组件与功能都依赖`src/util/fxios`
在实际项目中，引入`share/util/fxios`，然后再根据需要封装使用。

在实际项目中，尽量使用`share/util`中的工具。
