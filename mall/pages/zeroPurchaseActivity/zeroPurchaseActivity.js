// pages/zeroPurchaseActivity/zeroPurchaseActivity.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    hours: [0, 0],//小时
    minutes: [0, 0],//分钟
    seconds: [0, 0],//秒
    haoSeconds: [0, 0],//毫秒
    goodsItems:[],//商品
    grabbedNumber:0,//已抢到人数
    show:true,//左滑右滑弹窗
    shareList: {},//分享数据
    imageUrl:'../../assets/images/icon/shareActive.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init();
    that.chooseShare();
    var status = wx.getStorageSync('status')
    if (status){
      that.setData({
        show:false
      })
    }else{
      that.setData({
        show:true
      })
    }
  },
  chooseShare:function(){
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode: 3}, 'GET').then((res) => {
      if (res.data.content) {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }
        that.setData({
          shareList: res.data.content
        })
      }
    })
  },
  init: function() {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        let current = res.data.content.remainingTime
        let interval2 = setInterval(() => {
          if (current > 0) {
            current -=1000
            that.formatDuring(current)
          } else {
            clearInterval(interval2)
            this.setData({
              waitPay: ''
            })
          }
        }, 1000)
        that.setData({
          goodsItems: res.data.content.goodsItems,
          grabbedNumber: res.data.content.grabbedNumber
        })  
      }
    })
  },
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss / (1000 * 60 * 60)).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString()
    const haoSeconds = parseInt((mss % (60))).toString()
    that.setData({
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split(''),
      haoSeconds: haoSeconds.split('')
    })
  },
  //跳转到详情页
  jumpDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/zeroPurchase/zeroPurchase?id=${id}`,
    })
  },
  //左滑右滑蒙版消失
  hide:function(){
    var that = this
    that.setData({
      show:false
    })
    wx.setStorageSync('status', 1)
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
    var that = this
    // 来自页面内转发按钮
    that.setData({
      show: false
    })
    app.Util.ajax('mall/weChat/sharing/onSuccess', { mode: 2 }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '分享成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    return {
      path: that.data.shareList.link,
      imageUrl: that.data.imageUrl,
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})