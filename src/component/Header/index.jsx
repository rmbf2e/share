import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { observer, inject } from 'mobx-react'
import Menu from 'share/component/Menu'
import s from './style.m.less'

const { Header } = Layout

@inject('store')
@observer
export default class AppHeader extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        fetchMe: PropTypes.func,
      }),
      router: PropTypes.shape({
        location: PropTypes.object,
      }),
    }).isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const {
      store: { user },
      children,
    } = this.props
    return (
      <Header className={s.header}>
        <figure className={s.logo}>
          <img alt="logo" src="/asset/image/logo.png" />
          权限统一管理平台
        </figure>
        <Menu />
        {children}
        <figure className={s.me}>
          {user.me.name}
          <a onClick={user.logout} onKeyPress={user.logout}>
            注销
          </a>
        </figure>
      </Header>
    )
  }
}
