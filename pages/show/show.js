//获取应用实例
const app = getApp()

Page({
  data: {
    token: app.globalData.token,
    id: null,
    todo: {}
  },
  //事件处理函数
  onLoad: function (e) {
    this.setData({
      id: e.id
    })
  },
  onShow: function () {
    wx.showToast({
      title: '正在加载详情',
      icon: "none"
    })

    var that = this
    var id = this.data.id
    // 获取待办详情
    wx.request({
      url: 'https://nianmingchen.top/api/todos/' + id,
      data: {
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res.data.data)

        // 登录成功情况
        if (res.data.status == "success") {
          that.setData({
            todo: res.data.data.todo
          });
          wx.hideLoading()
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
            title: '获取待办列表接口异常',
            icon: "none"
          })
        }
      }
    })
  },
  del: function (e) {
    console.log(e)
    var that = this
    var id = e.target.id

    wx.request({
      url: 'https://nianmingchen.top/api/todos/' + id,
      data: {
        token: this.data.token
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      method: "DELETE",
      success: function (res) {
        console.log(res.data.data)

        // 登录成功情况
        if (res.data.status == "success") {
          wx.showToast({
            title: "删除成功",
            icon: "success"
          })

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
            title: '接口异常',
            icon: "none"
          })
        }
      }
    })
  },
  undo: function (e) {
    console.log(e)
    var that = this
    var id = e.target.id

    wx.request({
      url: 'https://nianmingchen.top/api/todos/' + id + '/undo',
      data: {
        token: this.data.token
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      method: "PUT",
      success: function (res) {
        console.log(res.data.data)

        // 登录成功情况
        if (res.data.status == "success") {
          that.setData({
            todo: res.data.data.todo
          });

          wx.showToast({
            title: "已标记为未完成",
            icon: "none"
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
            title: '接口异常',
            icon: "none"
          })
        }
      }
    })
  },
  done: function (e) {
    console.log(e)
    var that = this
    var id = e.target.id

    wx.request({
      url: 'https://nianmingchen.top/api/todos/' + id + '/done',
      data: {
        token: this.data.token
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      method: "PUT",
      success: function (res) {
        console.log(res.data.data)

        // 登录成功情况
        if (res.data.status == "success") {
          that.setData({
            todo: res.data.data.todo
          });

          wx.showToast({
            title: "已完成",
            icon: "success"
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
            title: '接口异常',
            icon: "none"
          })
        }
      }
    })
  },
  onUnload: function () {
    console.log("back")
  }
})
