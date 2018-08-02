import { toJS } from 'mobx'
import AppStore from 'share/store/app'

describe('测试AppStore', () => {
  it('测试me的setter方法', () => {
    const app = new AppStore()
    expect(app.me).toEqual({})
    const me = { name: 'adadfa' }
    app.setMe(me)
    expect(toJS(app.me)).toEqual(me)
    app.restoreMe()
    expect(app.me).toEqual({})
  })

  it('测试继承必须实现的方法', () => {
    const app = new AppStore()
    expect(() => app.fetchMe()).toThrow()
    expect(() => app.fetchMeta()).toThrow()
    expect(() => app.logout()).toThrow()
    expect(() => app.load()).toThrow()
  })

  it('继承新的app', () => {
    class NewApp extends AppStore {
      fetchMe = () => Promise.resolve()

      fetchMeta = () => Promise.resolve()

      logout = () => {}
    }
    const app = new NewApp()
    expect(() => app.fetchMe()).not.toThrow()
    expect(() => app.fetchMeta()).not.toThrow()
    expect(() => app.logout()).not.toThrow()
    expect(() => app.load()).not.toThrow()
  })
})
