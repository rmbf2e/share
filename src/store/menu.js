import { observable, action, toJS } from 'mobx'
import find from 'lodash/find'

class Menu {
  menus = []

  @observable selectedKeys = []

  @observable openKeys = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  setCurrent = ({ key }) => {
    this.selectedKeys[0] = key
    const menus = toJS(this.menus)
    const currentSubMenus = find(menus, m => find(m.children, c => c.to === key)) || menus[0]

    this.openKeys[0] = currentSubMenus.name
    import('store/sider').then(sider => sider.default.setMenus(currentSubMenus.children))
  }

  @action
  onOpenChange = keys => {
    this.openKeys = keys
  }
}

export default new Menu()
