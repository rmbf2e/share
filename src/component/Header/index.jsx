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
    className: PropTypes.string,
  }

  static defaultProps = {
    children: null,
    className: '',
  }

  render() {
    const {
      store: { app },
      children,
      className,
    } = this.props
    return (
      <Header className={`${s.header} ${className}`}>
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
