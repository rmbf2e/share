import React from 'react'
import { Table } from 'antd'
import { mount } from 'enzyme'
// import Animate from 'rc-animate'
import AnimateTable from 'share/component/AnimateTable'

describe('share/component/AnimateTable', () => {
  it('使用antd的Table', () => {
    const app = mount(<AnimateTable columns={[{ key: 'a', title: 'a' }]} />)
    expect(app.find(Table)).toHaveLength(1)
    const table = app.find(Table).at(0)
    expect(typeof table.prop('components').body.wrapper).toBe('function')
  })
})
