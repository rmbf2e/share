import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import createMemoryHistory from 'history/createMemoryHistory'
import 'core-js/shim'
import 'isomorphic-fetch'
import 'localstorage-polyfill'

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {},
    )
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js',
}
copyProps(window, global)

Enzyme.configure({ adapter: new Adapter() })

// make history
const routerStore = new RouterStore()
const appHistory = createMemoryHistory()
syncHistoryWithStore(appHistory, routerStore)
global.routerStore = routerStore
