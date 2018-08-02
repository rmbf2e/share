import EventEmitter from 'events'
import storeProp from 'share/storeProp'

@storeProp({
  setter: [
    {
      name: 'me',
      default: {},
    },
  ],
})
class App extends EventEmitter {
  // 获取当前登录用户后，获取网站必须元数据
  load = () => this.fetchMe().then(() => this.fetchMeta())

  // 获取系统必须元数据
  fetchMeta = () => {
    throw new Error('请先实现app store的fetchMeta方法')
  }

  fetchMe = () => {
    throw new Error('请先实现app store的fetchMe方法')
  }

  logout = () => {
    throw new Error('根据每个项目接口不同，实现自己的logout方法')
  }
}

export default App
