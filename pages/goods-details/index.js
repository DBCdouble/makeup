var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidePopup:true,
    quantity:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.getDetails(id);
  },
  getDetails: function (id) {
    wx.showLoading({
      title: '加载中',
    })
    util.http( app.globalData.baseUrl + '/goodinfo/appdetail?appkey=' + app.globalData.appkey + '&id=' + id, 'GET',(data) =>{
      this.setData({
        goodinfo: data.goodinfo,
        goodStyles: data.goodStyles
      });
      wx.hideLoading();
    });
      
    
  },
  goodStylesTap: function () {
    this.setData({
      hidePopup:false
    });
  },
  ciqGmodelTap: function (event) {
    let { id, ciqgmodel } = event.target.dataset;
    let { goodinfo } = this.data;
    goodinfo.ciqGmodel = ciqgmodel;
    this.setData({
      goodinfo
    });
  },
  quantityChange: function (value) {
    this.setData({
      quantity: value.detail.value
    });
  },
  count: function (event) {
    const { type } = event.target.dataset;
    let quantity = Number(this.data.quantity); 
    console.log(quantity);
    if ( type === "minus" && quantity > 1) {
      quantity-=1;
    }else if ( type === "plus" ) {
      quantity+=1
    }
    this.setData({quantity});
  },
  closePopup: function () {
    this.setData({
      hidePopup:true
    });
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