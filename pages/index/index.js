//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: app.globalData.token,
    todos: [],
    hideLoadMore: true
  },
  //事件处理函数
  onReady: function () {
    this.loadingList()
  },
  loadingList: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    var that = this
    // 获取todos列表
    wx.request({
      url: 'https://nianmingchen.top/api/todos',
      data: {
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新

        // 登录成功情况
        if (res.data.status == "success") {
          that.setData({
            todos: res.data.data.todos
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
  onShow: function () {
  },
  switch2Change: function (e) {
    console.log(e)
    var that = this
    var id = e.target.id
    var status = null;

    if (e.detail.value) {
      status = "done"
    }
    else {
      status = "undo"
    }

    wx.request({
      url: 'https://nianmingchen.top/api/todos/' + id + '/' + status,
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
            todos: res.data.data.todos
          });

          wx.showToast({
            title: res.data.data,
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: '待办任务清单小程序',
      path: '/pages/index/index',
      imageUrl: '/images/forward.jpg'
    }
  },
  onPullDownRefresh: function () {
    this.loadingList()
  },
  loadingMore: function () {
    var listSize = this.data.todos.length

    var that = this
    // 获取todos列表
    wx.request({
      url: 'https://nianmingchen.top/api/todos',
      data: {
        token: app.globalData.token,
        offset: listSize
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data)

        that.setData({
          hideLoadMore: true
        })

        // 登录成功情况
        if (res.data.status == "success") {
          that.setData({
            todos: that.data.todos.concat(res.data.data.todos)
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
  onReachBottom: function () {
    var that = this

    this.setData({
      hideLoadMore: false
    })

    this.loadingMore()
  }
})
