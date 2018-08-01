import React from 'react'
import { mount } from 'enzyme'
import { Layout, Card } from 'antd'
import ShareHeader from 'share/component/Header'

const { Header } = Layout

const logout = jest.fn()
const store = {
  app: {
    me: {
      name: 'ddd',
    },
    logout,
  },
}

describe('component/Content', () => {
  it('测试包含antd Header', () => {
    const com = mount(<ShareHeader store={store} />)
    expect(com.find(Header)).toHaveLength(1)
    com.unmount()
  })

  it('测试logout', () => {
    const com = mount(<ShareHeader store={store} />)
    expect(logout).not.toHaveBeenCalled()
    const a = com.find('a')
    a.simulate('click')
    expect(logout).toHaveBeenCalled()
    logout.mockRestore()
    com.unmount()
  })

  it('测试可包含children', () => {
    const com = mount(
      <ShareHeader store={store}>
        <Card>
card
        </Card>
      </ShareHeader>,
    )
    expect(com.find(Card)).toHaveLength(1)
    com.unmount()
  })
})
