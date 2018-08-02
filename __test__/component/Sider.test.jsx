import React from 'react'
import { mount } from 'enzyme'
import { Layout, Menu, Icon } from 'antd'
import App from 'share/component/App'
import Sider from 'share/component/Sider'
import MenuStore from 'share/store/menu'
import RouterStore from 'share/store/router'

const menu = new MenuStore()
const router = new RouterStore()
const store = {
  router,
  menu,
}

menu.setMenus([
  {
    name: 'parent1',
    children: [
      {
        name: 'child1',
        to: '/child1',
        icon: 'usergroup-add',
      },
    ],
  },
  {
    name: 'parent2',
    children: [
      {
        name: 'child2',
        to: '/child2',
        icon: 'html5',
      },
    ],
  },
])

menu.setCurrent({ key: '/child1' })

const Wrapper = () => (
  <App store={store}>
    <Sider />
  </App>
)

describe('Menu', () => {
  it('包含组件', () => {
    const com = mount(<Wrapper />)
    expect(com.find(Layout.Sider)).toHaveLength(1)
    expect(menu.sider.collapsed).toBe(true)
    const sider = com.find(Layout.Sider).at(0)
    sider.simulate('mouseover')
    expect(menu.sider.collapsed).toBe(false)
    sider.simulate('mouseout')
    expect(menu.sider.collapsed).toBe(true)
    expect(com.find(Menu.Item)).toHaveLength(1)
    expect(com.find(Icon)).toHaveLength(1)
  })
})
