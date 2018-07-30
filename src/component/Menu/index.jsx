import React from 'react'
import { toJS } from 'mobx'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import { observer, inject } from 'mobx-react'
import getFirstPathname from 'share/util/getFirstPathname'
import Link from './Link'

const { SubMenu } = Menu

@inject('store')
@observer
export default class Menus extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      sider: PropTypes.object,
      menu: PropTypes.object,
      router: PropTypes.object,
    }).isRequired,
  }

  componentWillMount() {
    const { store: { router: { history } } } = this.props
    this.stopSubscribeHistory = history.subscribe(location => {
      const { store: { menu } } = this.props
      const key = getFirstPathname(location.pathname)
      menu.setCurrent({ key })
    })
  }

  componentWillUnmount() {
    if (this.stopSubscribeHistory) {
      this.stopSubscribeHistory()
    }
  }

  renderMenus = () => {
    const {
      store: {
      menu,
      sider,
      router: { push },
      },
    } = this.props
    const menus = toJS(menu.menus)
    if (sider.collapsed) {
      return menus.map(topMenu => (
        <SubMenu key={topMenu.name} title={topMenu.name}>
          {topMenu.children.map(m => (
            <Menu.Item key={m.to}>
              <Link to={m.to}>
                {m.name}
              </Link>
            </Menu.Item>
          ))}
        </SubMenu>
      ))
    }
    return menus.map(topMenu => {
      const m = topMenu.children[0]
      return (
        <SubMenu
          key={topMenu.name}
          title={topMenu.name}
          onTitleClick={() => push(m.to)}
        />
      )
    })
  }

  render() {
    const { store: { menu } } = this.props
    const selectedKeys = toJS(menu.selectedKeys)
    const props = {
      selectedKeys,
      // onSelect: menu.setCurrent,
      mode: 'horizontal',
      // onOpenChange: menu.onOpenChange,
      // openKeys: toJS(menu.openKeys),
    }
    return (
      <Menu {...props}>
        {this.renderMenus()}
      </Menu>
)
  }
}
