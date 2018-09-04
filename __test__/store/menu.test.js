import Menu from 'share/store/menu'

describe('menuStore', () => {
  it('flatten menus', () => {
    const menu = new Menu()
    menu.setMenus([
      {
        name: '定价管理',
        children: [
          {
            name: '自动跟价开关',
            to: '/autoPriceSwitcher',
            icon: 'usergroup-add',
          },
        ],
      },
      {
        name: '调价审核',
        children: [
          {
            name: '人工审核',
            to: '/manualReview',
            icon: 'usergroup-add',
          },
        ],
      },
      {
        name: '系统设置',
        children: [
          {
            name: '用户管理',
            to: '/user',
            icon: 'usergroup-add',
          },
          {
            name: '用户管理',
            icon: 'usergroup-add',
          },
        ],
      },
      {
        name: '其他设置',
      },
    ])
    expect(Object.keys(menu.flattenMenus)).toEqual([
      '/autoPriceSwitcher',
      '/manualReview',
      '/user',
    ])
  })
})
