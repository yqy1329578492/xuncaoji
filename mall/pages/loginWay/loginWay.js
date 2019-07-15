// pages/loginWay/loginWay.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: []
  },
  //跳转到手机登录
  jumpPhoneLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  getPhoneNumber: function(e) {
    //给当前地址添加缓存，授权之后跳转回原页面
    var encryptedData = e.detail.encryptedData
    var iv = e.detail.iv
    var code = wx.getStorageSync('code')
    var inviterCode1 = wx.getStorageSync('inviterCode1') || ''
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.setStorageSync('encryptedData', encryptedData)
      wx.setStorageSync('iv', iv)
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 3] //获取当前页面的对象
      var url = currentPage.route
      if (url == 'pages/detail/detail') {
        wx.setStorage({
          key: "url",
          data: url + '?id=' + wx.getStorageSync('goods_id')
        })
      }
      app.globalData.flag = true
      wx.switchTab({
        url: '/pages/index/index'
      })
      app.Util.ajax('mall/account/authLogin', {
        encryptedData: encryptedData,
        iv: iv,
        code: code,
        inviterCode: inviterCode1
      }, 'POST').then((res) => {
        wx.setStorageSync('token', res.header.token)
        wx.setStorageSync('inviterCode', res.data.content.inviterCode)
        if (res.data.content) {
          app.Util.ajax('mall/personal/cityData', 'GET').then((res) => { // 使用ajax函数
            if (res.data.messageCode = 'MSG_1001') {
              this.setData({
                provinces: res.data.content
              })
              wx.setStorageSync('provinces', res.data.content)
            }
          })
        }
        wx.removeStorageSync('othersInviterCode')
      })
    } else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      app.globalData.flag = false
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})