import { observable, action, toJS } from 'mobx'
import find from 'lodash/find'
// import config from 'share/config'
import storeProp from 'share/storeProp'

@storeProp({
  // 定义menus属性与setMenus方法
  setter: [
    {
      name: 'menus',
      default: [],
    },
    {
      name: 'collapsed',
      default: true,
    },
  ],
})
class Sider {
  // constructor(parent) {
  //   this.parent = parent
  // }
  // sider默认折叠
  // @observable collapsed = true
  // @action
  // toggle = () => {
  //   this.collapsed = !this.collapsed
  //   // 如果关闭sider，清空顶部菜单的openKeys
  //   if (this.collapsed) {
  //     this.parent.onOpenChange([])
  //   }
  // }
}

@storeProp({
  // 定义menus属性与setMenus方法
  setter: [
    {
      name: 'menus',
      default: [],
    },
  ],
})
class Menu {
  sider = new Sider()

  @observable selectedKeys = []

  // @observable openKeys = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  setCurrent = ({ key }) => {
    this.selectedKeys[0] = key
    const menus = toJS(this.menus)
    const currentSubMenus = find(menus, m => find(m.children, c => c.to === key)) || menus[0]

    // this.openKeys[0] = currentSubMenus.name
    this.sider.setMenus(currentSubMenus.children)
  }

  // @action
  // onOpenChange = keys => {
  //   this.openKeys = keys
  // }
}

export default new Menu()
