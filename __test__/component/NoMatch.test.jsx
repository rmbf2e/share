import React from 'react'
import { mount } from 'enzyme'
import Exception from 'ant-design-pro/lib/Exception'
import App from 'share/component/App'
import NoMatch from 'share/component/NoMatch'

const store = {
  router: global.routerStore,
}

describe('Menu', () => {
  it('使用ant-pro的Exception', () => {
    const com = mount(
      <App store={store}>
        <NoMatch />
      </App>,
    )
    expect(com.find(Exception)).toHaveLength(1)
  })
})
