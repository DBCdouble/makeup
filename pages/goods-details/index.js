var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidePopup:true, //控制底部弹出层的显示隐藏
    quantity:1, //商品数量
    goodsNum:"", //购物车数量
    collectFlag:false //判断该商品是否收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsInfoId = options.id;
    this.setData({
      goodsInfoId
    });
    this.getDetails(goodsInfoId);
    this.getGoodsNum();
    this.getGoodsCollect();
  },
  getDetails: function (id) {
    wx.showLoading({
      title: '加载中',
    })
    util.http( app.globalData.baseUrl + '/goodinfo/appdetail?appTab=2&appkey=' + app.globalData.appkey + '&id=' + id, 'GET',(data) =>{
      this.setData({
        goodinfo: data.goodinfo,
        goodStyles: data.goodStyles
      });
      wx.hideLoading();
    });
      
    
  },
  getGoodsNum: function () {
    const { id } = wx.getStorageSync("userInfo").user; 
    util.http(app.globalData.baseUrl + '/user/shopping/total?appTab=2&appkey=' + app.globalData.appkey + '&userId=' + id, 'GET', (data) => {
      if( data.result === 0) {
        this.setData({
          goodsNum: data.total
        })
      }
    });
  },
  getGoodsCollect: function () {
    const { id } = wx.getStorageSync("userInfo").user; 
    const { goodsInfoId } = this.data;
    util.http(app.globalData.baseUrl + '/goodcollect/item?appTab=2&appkey=' + app.globalData.appkey + '&userId=' + id + "&goodinfoId=" + goodsInfoId, 'GET', (data) => {
      if( data.result === 0 ) {
        this.setData({
          collectFlag: data.flag
        });
      }
    });
  },
  goback: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  animation: function (bool) {
    
  },
  openPopup: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
      hidePopup: false
    });
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200);
    // this.setData({
    //   hidePopup:false
    // });
  },
  ciqGmodelTap: function (event) {
    let { id, ciqgmodel } = event.target.dataset;
    this.getDetails(id);
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
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        hidePopup: true
      })
    }.bind(this), 200)
  },
  //跳转到购物车
  goShopcart: function () {
    wx.switchTab({
      url: '/pages/shop-cart/index',
    })
  },
  //点击收藏按钮
  collect: function () {
    let { collectFlag } = this.data;
    const action = collectFlag ? 'cancel' : 'add';
    const method = collectFlag ? 'POST' : 'PUT'; 
    const { id } = wx.getStorageSync("userInfo").user;
    const { goodsInfoId } = this.data;
    util.http(app.globalData.baseUrl + `/goodcollect/${action}?appTab=2&appkey=` + app.globalData.appkey + "&userId=" + id + "&goodinfoId=" + goodsInfoId, method, (data) => {
      if (data.result === 0) {
        this.setData({
          collectFlag: data.flag
        });
      }
    });
  },
  // 加入购物车
  joinShopcart: function () {
    const { token , user : { id } } = wx.getStorageSync("userInfo");
    const { quantity } = this.data;
    const goodsInfoId  = this.data.goodinfo.id;
    util.http(app.globalData.baseUrl + `/v1.0/b2c/user/shopping?appTab=2&appkey=` + app.globalData.appkey + "&userId=" + id + "&goodsId=" + goodsInfoId + "&token=" + token + "&quantity=" + quantity + "&shipWay=3&appTab=2", 'PUT', (data) => {
      if (data.result === 0) {
        this.setData({
          goodsNum:data.total
        });
      } else if ( data.result === 400) {
        wx.removeStorageSync("userInfo");
        wx.navigateTo({
          url: '/pages/welcome/welcome',
        })
      }
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