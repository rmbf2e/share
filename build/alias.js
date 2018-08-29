const path = require('path')

const resolvePath = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
  share: resolvePath('./src'),
}
