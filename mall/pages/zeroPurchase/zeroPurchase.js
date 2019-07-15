// pages/zeroPurchase/zeroPurchase.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: 1, //商品id
    imageUrls: [], //轮播图
    detail: {}, //详情
    comment: [], //商品评论
    pageNumber: 1,
    pageSize: 6,
    shareList:{},//分享数据
    introductions: [], //店铺详情
    showModal:false,//公众号弹框
    inputValue1:'',//验证码
    show: false,//分享弹框
    hours: [0,0],//小时
    minutes: [0, 0],//分钟
    seconds: [0, 0],//秒
    haoSeconds: [0, 0],//毫秒
    inviterCode:'',
  },
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // home / activity / freeShopping / goodsDetail
    console.log(options)
    var that = this
    var id = options.id
    that.setData({
      goodsId: id
    })
    if (options.inviterCode){
      that.data.inviterCode = options.inviterCode
    }
    app.Util.ajax(`mall/home/activity/freeShopping/goodsDetail?id=${id}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        let current = res.data.content.remainingTime
        let interval2 = setInterval(() => {
          if (current > 0) {
            current -= 1000
            that.formatDuring(current)
          } else {
            clearInterval(interval2)
            this.setData({
              waitPay: ''
            })
          }
        }, 1000)
        that.setData({
          imageUrls: res.data.content.goodsItem.imageUrls,
          detail: res.data.content.goodsItem,
          introductions: res.data.content.goodsItem.introductions.length ? res.data.content.goodsItem.introductions : []
        })
      }
    })
    //商品评论
    that.comment();
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
  //商品评论
  comment: function() {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items.length > 0) {
          res.data.content.items[0].createTime = time.formatTimeTwo(res.data.content.items[0].createTime, 'Y-M-D h:m:s')
        }
        that.setData({
          goodInteractRate: res.data.content.goodInteractRate,
          comment: res.data.content.items
        })
      }
    })
  },
  //跳转到评价页面
  jumpEvaluate: function(e) {
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?goodsId=${goodsId}`
    })
  },
  //跳转到提交订单
  toPlaceorder: function(e) {
    var that = this
    var activityGoodsId = e.currentTarget.dataset.activitygoodsid
    var goodsId = e.currentTarget.dataset.goodsid
    var token = wx.getStorageSync('token')
    if(token){
      app.Util.ajax('mall/home/activity/freeShopping/placeOrder/validate', {
        goodsId: goodsId
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          if (res.data.content.status === 1) {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?activityGoodsId=${activityGoodsId}&goodsId=${goodsId}`
            })
          } else if (res.data.content.status === 2) {
            that.setData({
              show: true
            })
            app.Util.ajax('mall/weChat/sharing/target', { mode: 2, targetId: goodsId }, 'GET').then((res) => {
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
          } else if (res.data.content.status === 3) {
            that.setData({
              showModal: true
            })
          }
        } else {
          wx.showToast({
            title: '亲，留点机会给别人吧',
            icon: 'none'
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
      })
    }
    
  },
  //关闭公众号弹框
  hideModal:function(){
    var that = this;
    that.setData({
      showModal: false
    })
  },
  //获取验证码
  btnSumbit: function (e) {
    var that = this;
    var mesValue = e.detail.value
    that.setData({
      inputValue1: mesValue
    })
    console.log(mesValue)
  },
  sure:function(){
    var that = this
    if(that.data.inputValue1 ==''){
      wx.showToast({
        title: '请输入正确的验证码',
        icon:'none'
      })
    }else{
      app.Util.ajax('mall/weChat/weChatCheckCode', { code: that.data.inputValue1 }, 'POST').then((res) => {
        if (res.data.content===true) {
          wx.showToast({
            title: '关注成功!',
            icon: 'none'
          })
          that.setData({
            showModal:false
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }
      })
    }
  },
  //关闭分享弹框
  cancelShow:function(){
    var that = this
    that.setData({
      show:false
    })
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