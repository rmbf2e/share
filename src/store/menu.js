import { computed, observable, action, toJS } from 'mobx'
import storeProp from 'share/storeProp'

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
  // sider = new Sider()

  @observable
  selectedKeys = []

  // 设置当前激活状态的菜单
  // 在监听路由切换时调用
  @action
  setCurrent = ({ key }) => {
    this.selectedKeys[0] = key
  }
}

export default Menu
