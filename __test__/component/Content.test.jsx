import React from 'react'
import { mount } from 'enzyme'
import { Router, Switch } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition'
import Content from 'share/component/Content'
import Loading from 'share/component/Loading'
import RouterStore from 'share/store/router'

const router = new RouterStore()
const store = { router }

describe('component/Content', () => {
  it('测试包含Loading', () => {
    const com = mount(<Content loading store={store} />)
    expect(com.find(Loading)).toHaveLength(1)
    expect(com.find(AnimatedSwitch)).toHaveLength(0)
    expect(com.find(Router)).toHaveLength(0)
    expect(com.find(Switch)).toHaveLength(0)
  })

  it('测试包含AnimatedSwitch, Switch', () => {
    const com = mount(<Content loading={false} store={store} />)
    expect(com.find(Loading)).toHaveLength(0)
    expect(com.find(AnimatedSwitch)).toHaveLength(1)
    expect(com.find(Router)).toHaveLength(1)
    expect(com.find(Switch)).toHaveLength(1)
  })
})
