import React from 'react'
import PropTypes from 'prop-types'
import { Layout, notification, LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import fxios from 'share/util/fxios'
// import store from 'app/store'
import Header from 'share/component/Header'
import Content from 'share/component/Content'
import Sider from 'share/component/Sider'
// import { history } from 'share/store/router'
// import s from './style.m.less'

// 监听后端接口错误函数
const onApiError = error => {
  notification.error({
    message: '接口错误',
    description: error.message || error.toString(),
    duration: 3,
  })
}

// 监听后端接口成功提示
const onApiSuccess = (res, req) => {
  if (req.method !== 'get') {
    notification.success({
      message: '操作成功',
      description: res.message,
      duration: 3,
    })
  }
}

class App extends React.PureComponent {
  static propTypes = {
    store: PropTypes.shape({
      app: PropTypes.object,
    }).isRequired,
    Header: PropTypes.func,
    Sider: PropTypes.func,
    Content: PropTypes.func,
  }

  static defaultProps = {
    Header: null,
    Sider: null,
    Content: null,
  }

  state = {
    loadingMeta: true,
  }

  componentDidMount() {
    const {
      store: { app },
    } = this.props
    fxios.on('error', onApiError)
    fxios.on('success', onApiSuccess)
    app.load().then(() => {
      this.setState({
        loadingMeta: false,
      })
    })
  }

  // 解除监听接口错误
  componentWillUnmount() {
    fxios.removeListener('error', onApiError)
    fxios.removeListener('success', onApiSuccess)
  }

  // 监听页面错误
  componentDidCatch = error => {
    notification.error({
      message: '页面错误',
      description: error.toString(),
      placement: 'topLeft',
    })
  }

  render() {
    const { loadingMeta } = this.state
    const {
      store,
      Header: PropHeader,
      Content: PropContent,
      Sider: PropSider,
    } = this.props
    const {
      router: { history },
    } = store
    const AppHeader = PropHeader || Header
    const AppSider = PropSider || Sider
    const AppContent = PropContent || Content
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <Router history={history}>
            <Layout>
              <AppHeader />
              <Layout>
                <AppSider />
                <AppContent loading={loadingMeta} />
              </Layout>
            </Layout>
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default App
