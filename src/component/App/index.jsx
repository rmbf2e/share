import React from 'react'
import PropTypes from 'prop-types'
import { notification, LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import fxios from 'share/util/fxios'

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

/*
 * 项目最外层组件，负责监听事件
 * */
class App extends React.PureComponent {
  static propTypes = {
    store: PropTypes.shape({
      router: PropTypes.shape({
        history: PropTypes.object,
      }),
    }).isRequired,
    children: PropTypes.node.isRequired,
  }

  componentDidMount() {
    fxios.on('error', onApiError)
    fxios.on('success', onApiSuccess)
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
    const { store, children } = this.props
    const {
      router: { history },
    } = store
    return (
      <Provider store={store}>
        <LocaleProvider locale={zhCN}>
          <Router history={history}>
            {children}
          </Router>
        </LocaleProvider>
      </Provider>
    )
  }
}

export default App
