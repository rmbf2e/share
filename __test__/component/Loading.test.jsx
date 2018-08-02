import React from 'react'
import { mount } from 'enzyme'
import Loading from 'share/component/Loading'

describe('share/component/Loading', () => {
  it('测试error prop', () => {
    const com = mount(<Loading error={new Error('abc')} />)
    expect(com.text()).toContain('abc')
  })

  it('传text', () => {
    const com = mount(<Loading text="test text" />)
    expect(com.text()).not.toContain('组件加载中 ...')
    expect(com.text()).toContain('test text')
  })

  it('不传text', () => {
    const com = mount(<Loading />)
    expect(com.text()).not.toContain('test text')
    expect(com.text()).toContain('组件加载中 ...')
  })
})
