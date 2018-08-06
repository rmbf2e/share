import { action, extendObservable, observable } from 'mobx'
import upperFirst from 'lodash/upperFirst'
import castArray from 'lodash/castArray'
import fxios from 'share/util/fxios'

/*
 * 生成以命名为核心的添删改方法与相关的请求状态属性
 * 例如options为 [{
 *   name: 'group',
 *   default: {},
 *   create: {
 *     url: '/groups/create', // required
 *     request: fxios.post, // 可以不指定，默认按restfull接口规则
 *     interceptor: {
 *       request: (data) => {..}, // 预处理发送data
 *       response: (data) => {..}, // 处理接口返回data
 *     },
 *   },
 * }]
 * 会生成 group 属性，默认值为default
 * 会生成 creatingGroup 属性
 * 会生成 createGroup 方法
 * 如果没有create，则不会生成这两项
 *
 * update, fetch, destroy方法与create相同
 *
 * @param {Array} options
 * @return void
 * */
function rest(options) {
  castArray(options).forEach(option => {
    const { name } = option
    const upperName = upperFirst(name)
    const extendObject = {}
    const decoratorObject = {}
    const setMethod = `set${upperName}`
    extendObject[setMethod] = res => {
      this[option.name] = res.data ? res.data : res
    }
    const restoreMethod = `restore${upperName}`
    extendObject[restoreMethod] = () => {
      if (option.default) {
        this[option.name] = option.default
      }
    }
    extendObject[option.name] = option.default
    if (option.create) {
      const creating = `creating${upperName}`
      const createMethod = `create${upperName}`
      extendObject[creating] = false
      extendObject[createMethod] = (data, query, param) => {
        this[creating] = true
        const { create } = option
        if (create.interceptor && create.interceptor.request) {
          data = create.interceptor.request(data)
        }
        const request = option.create.request || fxios.post
        const promise = request({ url: create.url, param }, data).then(res => {
          if (this.emit) {
            this.emit(`${name}:changed`)
            this.emit(`${name}:created`, res)
          }
          this[restoreMethod]()
          if (create.interceptor && create.interceptor.response) {
            return create.interceptor.response(res)
          }
          return res
        })
        promise.finally(
          action(createMethod, () => {
            this[creating] = false
          }),
        )
        return promise
      }
      decoratorObject[createMethod] = action
    }
    if (option.update) {
      const updating = `updating${upperName}`
      const updateMethod = `update${upperName}`
      extendObject[updating] = false
      extendObject[updateMethod] = (data, query, param) => {
        this[updating] = true
        const { update } = option
        if (update.interceptor && update.interceptor.request) {
          data = update.interceptor.request(data)
        }
        const request = option.update.request || fxios.put
        const promise = request({ url: update.url, param }, data).then(res => {
          if (this.emit) {
            this.emit(`${name}:changed`)
            this.emit(`${name}:updated`, res)
          }
          this[restoreMethod]()
          if (update.interceptor && update.interceptor.response) {
            return update.interceptor.response(res)
          }
          return res
        })
        promise.finally(
          action(updateMethod, () => {
            this[updating] = false
          }),
        )
        return promise
      }
      decoratorObject[updateMethod] = action
    }
    if (option.destroy) {
      const destroying = `destroying${upperName}`
      const destroyMethod = `destroy${upperName}`
      extendObject[destroying] = false
      extendObject[destroyMethod] = (data, param) => {
        this[destroying] = true
        const { destroy } = option
        if (destroy.interceptor && destroy.interceptor.request) {
          data = destroy.interceptor.request(data)
        }
        const request = option.destroy.request || fxios.delete
        const promise = request({ url: destroy.url, param }, data).then(res => {
          if (this.emit) {
            this.emit(`${name}:changed`)
            this.emit(`${name}:destroyed`, res)
          }
          this[restoreMethod]()
          if (destroy.interceptor && destroy.interceptor.response) {
            return destroy.interceptor.response(res)
          }
          return res
        })
        promise.finally(
          action(destroyMethod, () => {
            this[destroying] = false
          }),
        )
        return promise
      }
      decoratorObject[destroyMethod] = action
    }
    if (option.fetch) {
      const fetching = `fetching${upperName}`
      const fetchMethod = `fetch${upperName}`
      extendObject[fetching] = false
      extendObject[fetchMethod] = (query, param) => {
        this[fetching] = true
        const fetchObj = option.fetch
        const setAction = action(setMethod, res => {
          if (fetchObj.interceptor && fetchObj.interceptor.response) {
            res = fetchObj.interceptor.response(res)
          }
          extendObject[setMethod](res)
          return res
        })
        if (fetchObj.interceptor && fetchObj.interceptor.request) {
          query = fetchObj.interceptor.request(query)
        }
        const request = option.fetch.request || fxios.get
        const promise = request({ url: fetchObj.url, param }, query).then(
          setAction,
        )
        promise.finally(
          action(fetchMethod, () => {
            this[fetching] = false
          }),
        )
        return promise
      }
      decoratorObject[fetchMethod] = action
      decoratorObject[option.name] = observable.shallow
    }
    decoratorObject[setMethod] = action
    extendObservable(this, extendObject, decoratorObject)
  })
}

export default rest
