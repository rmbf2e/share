import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'antd/lib/layout'
import { observer, inject } from 'mobx-react'
import s from './style.m.less'

const { Header } = Layout

@inject('store')
@observer
class AppHeader extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      app: PropTypes.shape({
        logout: PropTypes.func,
        me: PropTypes.object,
      }),
    }).isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const {
      store: { app },
      children,
    } = this.props
    return (
      <Header className={s.header}>
        {children}
        <figure className={s.me}>
          {app.me.name}
          <a onClick={app.logout} onKeyPress={app.logout}>
            注销
          </a>
        </figure>
      </Header>
    )
  }
}
export default AppHeader
