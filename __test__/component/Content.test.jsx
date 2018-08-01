import React from 'react'
import { mount } from 'enzyme'
import { Router, Switch } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'
import Content from 'share/component/Content'
import Loading from 'share/component/Loading'
import RouterStore from 'share/store/router'

const router = new RouterStore()

const ContentWrapper = ({ loading }) => (
  <Router history={router.history}>
    <Content loading={loading} />
  </Router>
)

describe('component/Content', () => {
  it('测试包含Loading', () => {
    const com = mount(<ContentWrapper loading />)
    expect(com.find(Loading)).toHaveLength(1)
    expect(com.find(AnimatedSwitch)).toHaveLength(0)
    expect(com.find(Switch)).toHaveLength(0)
    com.unmount()
  })

  it('测试包含AnimatedSwitch, Switch', () => {
    const com = mount(<ContentWrapper loading={false} />)
    expect(com.find(Loading)).toHaveLength(0)
    expect(com.find(AnimatedSwitch)).toHaveLength(1)
    expect(com.find(Switch)).toHaveLength(1)
    com.unmount()
  })
})
