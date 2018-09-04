import { computed, observable, action, toJS } from 'mobx'
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

  @observable
  selectedKeys = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  setCurrent = ({ key }) => {
    this.selectedKeys[0] = key
    const menus = toJS(this.menus)
    const currentSubMenus =
      find(menus, m => find(m.children, c => c.to === key)) || menus[0]

    this.sider.setMenus(currentSubMenus.children)
  }

  // 将tree结构menus转换为key => value形式一维结构，key为'to'，value为menu对象本身
  // 只遍历两层menu，如果有三层menu结构再修改代码
  @computed
  get flattenMenus() {
    return toJS(this.menus).reduce((result, topMenu) => {
      if (topMenu.children) {
        topMenu.children.forEach(menu => {
          if (menu.to) {
            result[menu.to] = menu
          }
        })
      }
      return result
    }, {})
  }
}

export default Menu
