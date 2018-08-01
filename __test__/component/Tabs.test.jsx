import React from 'react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import createMemoryHistory from 'history/createMemoryHistory'
import { mount } from 'enzyme'
import Tabs from 'share/component/Tabs'

const routerStore = new RouterStore()

const appHistory = createMemoryHistory()
syncHistoryWithStore(appHistory, routerStore)

const { TabPane } = Tabs

const onChange = jest.fn()
const App = (
  <Tabs onChange={onChange} store={{ router: routerStore }}>
    <TabPane tab="One" key="one">
      One
    </TabPane>
    <TabPane tab="Two" key="two">
      Two
    </TabPane>
  </Tabs>
)

describe('components/Tabs', () => {
  it('default tab memory by hash', () => {
    appHistory.push({
      hash: 'one',
    })
    let app = mount(App)
    // const appRender = app.render()
    expect(app.find('.ant-tabs-tab')).toHaveLength(2)
    expect(app.find('.ant-tabs-tab-active')).toHaveLength(1)
    expect(app.find('.ant-tabs-tab-active').text()).toBe('One')
    app.instance().wrappedInstance.onChangeTab('two')
    app.unmount()

    appHistory.push({
      hash: 'two',
    })
    app = mount(App)
    expect(app.find('.ant-tabs-tab-active').text()).toBe('Two')
    app.unmount()
  })

  it('测试onChange prop', () => {
    onChange.mockClear()
    appHistory.push({
      hash: 'two',
    })
    const app = mount(App)
    expect(onChange).not.toHaveBeenCalled()
    const tabTitle = app.find('.ant-tabs-tab').at(0)
    tabTitle.simulate('click')
    expect(onChange).toHaveBeenCalledWith('one')
    app.unmount()
  })
})
