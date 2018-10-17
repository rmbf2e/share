import React from 'react'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { inject, observer } from 'mobx-react'
import getFirstPathname from 'share/util/getFirstPathname'
import Link from './Link'
import s from './styles.m.less'

// 用解构赋值jest --coverage时说Menu is not defined
// eslint-disable-next-line
const SubMenu = Menu.SubMenu

/*
 * 在Header头文件中使用的菜单项组件
 * */
@inject('store')
@observer
class Menus extends React.Component {
  stopSubscribeHistory = null

  static propTypes = {
    store: PropTypes.shape({
      menu: PropTypes.object,
      router: PropTypes.object,
    }).isRequired,
  }

  componentWillMount() {
    const {
      store: {
        router: { history },
      },
    } = this.props
    this.stopSubscribeHistory = history.subscribe(location => {
      const {
        store: { menu },
      } = this.props
      const key = getFirstPathname(location.pathname)
      // 初始化在根路径上，key是'/'，不会为空
      menu.setCurrent({ key })
    })
  }

  componentWillUnmount() {
    this.stopSubscribeHistory()
  }

  renderMenus = () => {
    const {
      store: { menu },
    } = this.props
    const menus = toJS(menu.menus)
    return menus.map(topMenu => (
      <SubMenu
        key={topMenu.name}
        title={
          <React.Fragment>
            {topMenu.name}
            <Icon type="down" className={s.icon} />
          </React.Fragment>
        }
      >
        {topMenu.children &&
          topMenu.children.map(m => {
            if (m.children) {
              return (
                <SubMenu key={m.name} title={m.name}>
                  {m.children.map(c => (
                    <Menu.Item key={c.to}>
                      <Link to={c.to}>{c.name}</Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              )
            }
            return (
              <Menu.Item key={m.to}>
                <Link to={m.to}>{m.name}</Link>
              </Menu.Item>
            )
          })}
      </SubMenu>
    ))
  }

  render() {
    const {
      store: { menu },
    } = this.props
    const selectedKeys = toJS(menu.selectedKeys)
    // const props = {
    //   selectedKeys,
    //   // onSelect: menu.setCurrent,
    //   mode: 'horizontal',
    //   // onOpenChange: menu.onOpenChange,
    //   // openKeys: toJS(menu.openKeys),
    // }
    return (
      <Menu selectedKeys={selectedKeys} mode="horizontal">
        {this.renderMenus()}
      </Menu>
    )
  }
}
export default Menus
