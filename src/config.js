// for test develop compoennt
// in real app you could extend this config for your app config
module.exports = {
  baseURL: '/api/',
  pageSize: 20,
  loginHost: `${process.env.LOGIN_HOST === 'test' ? 'http' : 'https'}://${
    process.env.LOGIN_HOST === 'test' ? 'test.' : ''
  }ssa.jd.com/sso/login`,
  logoutHost: `${process.env.LOGIN_HOST === 'test' ? 'http' : 'https'}://${
    process.env.LOGIN_HOST === 'test' ? 'test.' : ''
  }ssa.jd.com/sso/logout`,
  pageSizeOptions: ['20', '30', '50'],

  // sider默认折叠
  siderCollapsed: false,
}
