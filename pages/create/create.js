//获取应用实例
const app = getApp()

Page({
  data: {
    token: app.globalData.token,
    content: '',
    tags: []
  },
  //事件处理函数
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var tags = this.data.tags, values = e.detail.value;
    for (var i = 0, lenI = tags.length; i < lenI; ++i) {
      tags[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (tags[i].id == values[j]) {
          tags[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      tags: tags
    });
  },
  formSubmit: function (e) {
    console.log('formSubmit事件，携带value值为：', e.detail.value);

    var content = e.detail.value.content
    var tags = this.data.tags

    // 收集选中的标签
    var tag_ids = []
    for (var i = 0, lenI = tags.length; i < lenI; ++i) {
      if (tags[i].checked) {
        tag_ids.push(tags[i].id)
      }
    }

    var that = this
    // 新增todo
    wx.request({
      url: 'https://nianmingchen.top/api/todos',
      data: {
        token: this.data.token,
        todo: {
          content: content,
          finish_status: false,
          tag_ids: tag_ids
        }
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log(res)

        // 登录成功情况
        if (res.data.status == "success") {
          wx.showToast({
            title: "新增待办成功",
            icon: "success"
          })

          // 清空输入框和取消标签的选中
          for (var i = 0, lenI = tags.length; i < lenI; ++i) {
            tags[i].checked = false
          }

          that.setData({
            content: '',
            tags: tags
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
            title: '创建待办接口异常',
            icon: "none"
          })
        }
      }
    })
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '添加待办'
    })

    wx.showNavigationBarLoading() //在标题栏中显示加载

    var that = this

    // 获取tags列表
    wx.request({
      url: 'https://nianmingchen.top/api/tags',
      data: {
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data.tags)
        that.setData({
          tags: res.data.data.tags
        });

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        
        // 登录成功情况
        if (res.data.status == "success") {
          that.setData({
            tags: res.data.data.tags
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
            title: '获取标签接口异常',
            icon: "none"
          })
        }
      }
    })
  }
})
