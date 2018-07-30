import React from 'react'
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
  state = {
    loadingMeta: true,
  }

  componentDidMount() {
    const { store } = this.props
    fxios.on('error', onApiError)
    fxios.on('success', onApiSuccess)
    store.app.load().then(() => {
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
    const { store } = this.props
    const { router: { history } } = store
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <Router history={history}>
            <Layout>
              <Header />
              <Layout>
                <Sider />
                <Content loading={loadingMeta} />
              </Layout>
            </Layout>
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default App
