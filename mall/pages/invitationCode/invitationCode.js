// pages/invitationCode/invitationCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:''
  },
  bindInput:function(e){
    var that=this
    var inputValue = e.detail.value
    that.setData({
      inputValue: inputValue
    })    
  },
  //跳转到选择登录方式
  jumpIndex:function(){
    var that = this
    if (that.data.inputValue ==''){
      wx.showToast({
        title: '请输入正确的邀请码',
        icon:'none'
      })
    }else{
      wx.setStorageSync('inviterCode1', that.data.inputValue)
      wx.navigateTo({
        url: '/pages/loginWay/loginWay'
      })
    }
  },
  nextStep: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/loginWay/loginWay'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})