import pull from 'lodash/pull'

/**
 * 判定url中query中的项目是否是空值
 * @param {any} v the query value
 * @return {boolean} test result
 * */
const isEmptyQuery = v => {
  if (Array.isArray(v)) {
    pull(v, null, '', undefined)
    return v.length === 0
  }
  return v === null || v === undefined || v === ''
}

export default isEmptyQuery
