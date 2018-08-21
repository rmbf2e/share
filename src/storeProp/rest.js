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
 * 会生成 group 属性，默认值为default属性中的{}
 * 会生成 creatingGroup 属性
 * 会生成 createGroup 方法
 * 如果没有create，则不会生成上面这两项
 * 会生成 restoreGroup 方法，将group恢复成默认值
 *
 * update, fetch, destroy方法与create相同
 *
 * create, update, destroy方法成功后，如果该class继承自events，有emit方法，则会emit `${name}:changed`事件，无emit参数
 * 同时emit `${name}:${created}`事件，emit参数为请求的response，与请求的数据对象{ data, query }，data为请求体，query为url query
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
    const methods = ['create', 'update', 'destroy']
    const httpMethods = ['post', 'put', 'delete']
    const pastWords = ['created', 'updated', 'destroyed']
    const ingWords = ['creating', 'updating', 'destroying']
    methods.forEach((method, index) => {
      if (option[method]) {
        const ing = `${ingWords[index]}${upperName}`
        const doIt = `${method}${upperName}`
        extendObject[ing] = false
        extendObject[doIt] = (data, query, param) => {
          this[ing] = true
          const { [method]: methodOption } = option
          if (methodOption.interceptor && methodOption.interceptor.request) {
            data = methodOption.interceptor.request(data)
          }
          const request = option[method].request || fxios[httpMethods[index]]
          const promise = request({ url: methodOption.url, param }, data).then(
            res => {
              if (this.emit) {
                this.emit(`${name}:changed`)
                this.emit(`${name}:${pastWords[index]}`, res, { data, query })
              }
              this[restoreMethod]()
              if (
                methodOption.interceptor
                && methodOption.interceptor.response
              ) {
                return methodOption.interceptor.response(res)
              }
              return res
            },
          )
          promise.finally(
            action(`stop ${ing}`, () => {
              this[ing] = false
            }),
          )
          return promise
        }
        decoratorObject[doIt] = action
      }
    })
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
    decoratorObject[restoreMethod] = action
    extendObservable(this, extendObject, decoratorObject)
  })
}

export default rest
