import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Select, Form } from 'antd'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import pluralize from 'pluralize'
import upperFirst from 'lodash/upperFirst'
import Menu from 'component/Menu'
// import debounce from 'lodash/debounce'
// import contentContainer from 'mixin/contentContainer'
import s from './style.m.less'

const { Header } = Layout
const { Option } = Select

@inject('store')
@observer
export default class AppHeader extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      user: PropTypes.shape({
        fetchMe: PropTypes.func,
      }),
      site: PropTypes.shape({
        siteOption: PropTypes.object,
      }),
      app: PropTypes.shape({
        site: PropTypes.string,
        setSite: PropTypes.func,
      }),
      router: PropTypes.shape({
        location: PropTypes.object,
      }),
    }).isRequired,
  }

  state = {
    className: s.header,
  }

  // 监听滚动，隐藏header
  // componentDidMount() {
  //   this.dom = contentContainer()
  //   this.dom.addEventListener('scroll', this.onScroll)
  // }

  // componentWillUnmount() {
  //   this.dom.removeEventListener('scroll', this.onScroll)
  //   this.prevScrollpos = this.dom.scrollTop
  // }

  // onScroll = debounce(() => {
  //   const { dom, prevScrollpos } = this
  //   const currentScrollPos = dom.scrollTop
  //   // console.log(dom.scrollTop)
  //   if (prevScrollpos > currentScrollPos) {
  //     this.setState({
  //       className: s.header,
  //     })
  //     // console.log('scrollUp')
  //     // } else if (currentScrollPos > 60) {
  //   } else {
  //     this.setState({
  //       className: `${s.header} ${s.hide}`,
  //     })
  //     // console.log('scrollDown')
  //   }
  //   this.prevScrollpos = currentScrollPos
  // }, 600)

  // 通过路由获取当前页面名称
  // 在通过名称刷新页面对应的列表
  setSite = site => {
    const { app, router } = this.props.store
    app.setSite(site)
    app.fetchMeta()
    let pathname = router.location.pathname.replace(/^\//, '')
    // 默认路由
    if (!pathname) {
      pathname = 'role'
    }
    const store = this.props.store[pathname]
    if (pathname === 'resource') {
      store.fetchTree()
      store.setSearchPid('0')
    }
    const fetchMethodName = `fetch${upperFirst(pluralize(pathname))}`
    store[fetchMethodName]()
  }

  render() {
    const { user, site, app } = this.props.store
    const siteOption = toJS(site.siteOption)
    return (
      <Header className={this.state.className}>
        <figure className={s.logo}>
          <img alt="logo" src="/asset/image/logo.png" />
          权限统一管理平台
        </figure>
        <Menu />
        <Form layout="inline" className={s.form}>
          <Form.Item label="当前站点">
            <Select value={app.site} onChange={this.setSite}>
              {siteOption.map(o => (
                <Option key={o.name} value={o.name}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
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
