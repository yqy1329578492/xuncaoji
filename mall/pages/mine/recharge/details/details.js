// pages/mine/recharge/details/details.js
var time = require('../../../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:1,
    pageSize:10,
    items:[],
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.init();
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/personal/balanceDetails', { pageNumber: that.data.pageNumber, pageSize: that.data.pageSize, status: 1 }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        for (var i = 0; i < res.data.content.items.items.length; i++) {
          res.data.content.items.items[i].tradeTime = time.formatTimeTwo(res.data.content.items.items[i].tradeTime, 'Y-M-D h:m:s');
        }
        that.setData({
          items: res.data.content.items.items
        })
      }
    })
  },
  getMore:function(){
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //销量排行榜
    app.Util.ajax('mall/personal/balanceDetails', { pageNumber: pageNumber, pageSize: that.data.pageSize, status: 1 },'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items.items == '' && that.data.items !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.items
        for (var i = 0; i < res.data.content.items.items.length; i++) {
          res.data.content.items.items[i].tradeTime = time.formatTimeTwo(res.data.content.items.items[i].tradeTime, 'Y-M-D h:m:s');
          arr.push(res.data.content.items.items[i])
        }
        that.setData({
          items: arr,
        })
        that.setData({
          pageNumber: pageNumber
        })
      }
    })
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
    var that = this
    // that.setData({
    //   pageNumber: 1
    // })
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
    var that = this
    that.getMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})