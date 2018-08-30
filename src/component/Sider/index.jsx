import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Layout, Icon } from 'antd'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import MenuLink from 'share/component/Menu/Link'

@inject('store')
@observer
class Sider extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      menu: PropTypes.object,
      // sider: PropTypes.object,
      router: PropTypes.object,
    }).isRequired,
  }

  show = () => {
    const {
      store: {
        menu: { sider },
      },
    } = this.props
    sider.setCollapsed(false)
  }

  hide = () => {
    const {
      store: {
        menu: { sider },
      },
    } = this.props
    sider.setCollapsed(true)
  }

  render() {
    const {
      store: { menu },
    } = this.props
    const { sider } = menu
    const menus = toJS(sider.menus)
    const selectedKeys = toJS(menu.selectedKeys)
    return (
      <Layout.Sider
        collapsed={sider.collapsed}
        collapsedWidth={50}
        onMouseOver={this.show}
        onFocus={this.show}
        onMouseOut={this.hide}
        onBlur={this.hide}
      >
        <Menu
          onSelect={menu.setCurrent}
          selectedKeys={selectedKeys}
          mode="inline"
        >
          {menus.map(m => (
            <Menu.Item key={m.to}>
              <MenuLink to={m.to}>
                <Icon type={m.icon} />
                <span>{m.name}</span>
              </MenuLink>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Sider>
    )
  }
}
export default Sider
