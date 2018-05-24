//app.js
App({
  onLaunch: function () {
  },
  onShow: function () {
    // 获取token
    this.globalData.token = wx.getStorageSync("token")

    this.require_login()
  },
  onHide: function () {
    // DO NOTHING
  },
  require_login: function () {
    // 如果未登录就重定向，让用户登录
    if (this.globalData && this.globalData.token == '') {
      wx.navigateTo({
        url: 'pages/login/login'
      })
    }
  },
  globalData: {
    token: "",
    userInfo: null
  }
})