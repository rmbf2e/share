import React from 'react'
import { mount } from 'enzyme'
import { render, unmountComponentAtNode } from 'react-dom'
import { toJS } from 'mobx'
import { Menu as AntMenu } from 'antd'
// import { render, unmountComponentAtNode } from 'react-dom'
import Link from 'share/component/Menu/Link'
import App from 'share/component/App'
import Menu from 'share/component/Menu'
import MenuStore from 'share/store/menu'
import RouterStore from 'share/store/router'

const { SubMenu } = AntMenu

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
  {
    name: 'parent3',
  },
])
menu.setCurrent({ key: 'child1' })

const Wrapper = () => (
  <App store={store}>
    <Menu />
  </App>
)

describe('Menu', () => {
  it('挂载之后开始监听history', done => {
    const com = mount(<Wrapper />)
    expect(menu.sider.collapsed).toBe(true)
    const text = com.text()
    expect(text.includes('parent1')).toBe(true)
    expect(text.includes('parent2')).toBe(true)
    expect(text).not.toContain('child1')
    expect(toJS(menu.selectedKeys)).toEqual(['/'])
    const submenu = com.find(SubMenu).at(0)
    expect(submenu.prop('onTitleClick')).toBe(undefined)
    router.push('/child2')
    expect(toJS(menu.selectedKeys)).toEqual(['/child2'])
    // const spy = jest.spyOn(com, 'stopSubscribeHistory')
    // expect(spy).not.haveBeenCalled()
    com.unmount()
    // 卸载后不再监听同步menu的selectedKeys
    router.push('/child1')
    expect(toJS(menu.selectedKeys)).toEqual(['/child2'])
    done()
  })

  it('menu.sider.collapsed为false时', done => {
    router.push('/')
    menu.sider.setCollapsed(false)
    expect(menu.sider.collapsed).toBe(false)
    const com = mount(<Wrapper />)
    const submenu = com.find(SubMenu).at(1)
    expect(toJS(menu.selectedKeys)).toEqual(['/'])
    // 不知为什么不能用className find到，所以用html代替
    expect(
      com
        .find('li.ant-menu-submenu')
        .at(1)
        .html(),
    ).not.toContain('ant-menu-item-active')
    submenu.prop('onTitleClick')()
    expect(toJS(menu.selectedKeys)).toEqual(['/child2'])
    com.unmount()
    done()
  })

  // it('测试点击Link，to与pathname相同则拦截返回false', () => {
  //   router.push('/')
  //   const A = () => (
  //     <App store={store}>
  //       <div>
  //         <Link to="/path1">
  // path1
  //         </Link>
  //         <Link to="/path2">
  // path2
  //         </Link>
  //       </div>
  //     </App>
  //   )
  //   const com = mount(<A />)
  //   const link1 = com.find(Link).at(0)
  //   // expect(spy).not.toHaveBeenCalledWith('/path1')
  //   console.log(toJS(router.location))
  //   link1.simulate('click')
  //   link1.simulate('click')
  //   console.log(toJS(router.location))
  // })

  it('测试点击Link，to与pathname相同则拦截返回false，enzyme的不灵，上真实dom', () => {
    router.push('/')
    const A = () => (
      <App store={store}>
        <div>
          <Link to="/path1">path1</Link>
          <Link to="/path2">path2</Link>
        </div>
      </App>
    )
    const { document } = global
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<A />, div)
    const a = document.querySelector('a')
    const spy = jest.spyOn(router.history, 'push')
    expect(router.location.pathname).toEqual('/')
    a.click()
    expect(router.location.pathname).toEqual('/path1')
    expect(spy.mock.calls).toEqual([['/path1']])
    // 多次click，不会再执行history操作
    a.click()
    a.click()
    expect(spy.mock.calls).toEqual([['/path1']])

    unmountComponentAtNode(div)
    document.body.removeChild(div)
  })
})
