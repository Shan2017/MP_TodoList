//获取应用实例
const app = getApp()

Page({
  data: {
    token: app.globalData.token
  },
  //事件处理函数
  login: function (e) {
    // 1、登录
    wx.login({
      success: res => {
        // 1.1、发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: "https://nianmingchen.top/api/weixin_user",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json', // 默认值
            'Accept': 'application/json'
          },
          method: "POST",
          success: function (res) {
            console.log(res.data)

            // 登录成功情况
            if (res.data.status == "success") {
              wx.showToast({
                title: "登录成功",
                icon: "success"
              })

              wx.setStorageSync("token", res.data.data.token)
              app.globalData.token = res.data.data.token

              // 切换到首页
              wx.switchTab({
                url: '../index/index'
              })
            }
            // 登录失败情况
            else if (res.data.status == "error") {
              wx.showToast({
                title: res.data.data,
                icon: "none"
              })
            }
            // 接口返回值异常情况
            else {
              wx.showToast({
                title: '登录接口异常',
                icon: "none"
              })
            }
          }
        })
      }
    })
    // 2、获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})
