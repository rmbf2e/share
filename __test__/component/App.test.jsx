import React from 'react'
import { mount } from 'enzyme'
import { notification, LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import { Router } from 'react-router-dom'
import App from 'share/component/App'
import RouterStore from 'share/store/router'
import fxios from 'share/util/fxios'

const router = new RouterStore()
const store = { router }

const ErrorComp = ({ error }) => {
  if (error) {
    throw new Error()
  }
  return 'error app'
}

class TestApp extends React.Component {
  state = {
    error: false,
  }

  render() {
    const { error } = this.state
    return (
      <App store={store}>
        <div>
          <button
            type="button"
            onClick={() => {
              this.setState({
                error: true,
              })
            }}
          >
            button
          </button>
          <ErrorComp error={error} />
        </div>
      </App>
    )
  }
}

describe('测试App', () => {
  it('测试App内包含组件', () => {
    const com = mount(<TestApp />)
    expect(com.find(LocaleProvider)).toHaveLength(1)
    expect(com.find(Provider)).toHaveLength(1)
    expect(com.find(Router)).toHaveLength(1)
    com.unmount()
  })

  it('测试App卸载后，移除fxios监听', () => {
    const com = mount(<TestApp />)
    expect(fxios.listeners('success')).toHaveLength(1)
    expect(fxios.listeners('error')).toHaveLength(1)
    com.unmount()
    expect(fxios.listeners('success')).toHaveLength(0)
    expect(fxios.listeners('error')).toHaveLength(0)
  })

  it('测试App绑定fxios success事件', () => {
    const com = mount(<TestApp />)
    const spy = jest.spyOn(notification, 'success')
    expect(spy).not.toHaveBeenCalled()
    fxios.emit('success', { message: 'abc' }, { method: 'post' })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      message: '操作成功',
      description: 'abc',
      duration: 3,
    })
    com.unmount()
    spy.mockRestore()
  })

  it('测试App绑定fxios success事件，get方法不会调用', () => {
    const com = mount(<TestApp />)
    const spy = jest.spyOn(notification, 'success')
    expect(spy).not.toHaveBeenCalled()
    fxios.emit('success', { message: 'abc' }, { method: 'get' })
    expect(spy).toHaveBeenCalledTimes(0)
    com.unmount()
    spy.mockRestore()
  })

  it('测试App绑定fxios error事件', () => {
    const com = mount(<TestApp />)
    const spy = jest.spyOn(notification, 'error')
    expect(spy).not.toHaveBeenCalled()
    fxios.emit('error', { message: 'error' })
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'error',
      duration: 3,
    })
    fxios.emit('error', new Error('error message'))
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'error message',
      duration: 3,
    })
    fxios.emit('error', 'string message')
    expect(spy).toHaveBeenCalledWith({
      message: '接口错误',
      description: 'string message',
      duration: 3,
    })
    com.unmount()
    spy.mockRestore()
  })

  it('App负责捕获组件内错误', () => {
    const com = mount(<TestApp />)
    const button = com.find('button')
    const spy = jest.spyOn(notification, 'error')
    expect(spy).not.toHaveBeenCalled()
    const preventEmit = jest
      // eslint-disable-next-line
      .spyOn(global._virtualConsole, 'emit')
      .mockImplementation(() => false)
    const preventConsole = jest
      .spyOn(console, 'error')
      .mockImplementation(() => false)
    button.simulate('click')
    expect(spy).toHaveBeenCalled()
    com.unmount()
    spy.mockRestore()
    preventEmit.mockRestore()
    preventConsole.mockRestore()
  })
})
