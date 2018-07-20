var app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoppingList:[],
    allSelect:true,
    noSelect:false,
    totolPrice:0,
    saveHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShoppingList();
  },
  getShoppingList: function () {
    console.time("获取购物车列表时间");
    utils.http(app.globalData.baseUrl + '/v1.0/b2c/user/shopping?appkey=' + app.globalData.appkey + "&userId=7589","GET", (data)=>{
      this.setData({
        shoppingList: data.data.shoppingList
      });
      console.timeEnd("获取购物车列表时间");
    });
  },
  //数量输入框change事件
  quantityChange: function (event) {
    const quantity = Number(event.detail.value);
    const index = event.target.dataset.index;
    let { shoppingList } = this.data;
    shoppingList[index].quantity = quantity;
    this.setData({
      shoppingList
    });
    console.log(shoppingList);
  },
  // 单个商品勾选
  selectChange: function (event) {
    const { index } = event.target.dataset;
    let { shoppingList } = this.data;
    let select =  shoppingList[index].select;
    if (select) {
      shoppingList[index].select = false;
    } else {
      shoppingList[index].select = true;
    }
    this.setData({
      shoppingList
    });
  },
  //单个商品的数量加减事件
  count: function (event) {
    const { opt } = event.target.dataset;
    const { index } = event.target.dataset;
    let { shoppingList } = this.data;
    let { quantity } = shoppingList[index];
    if (opt === "minus" && shoppingList[index].quantity > 1) {
      shoppingList[index].quantity = Number(quantity) - 1;
    } else if( opt === "plus" ) {
      shoppingList[index].quantity = Number(quantity) + 1;
    }
    this.setData({
      shoppingList
    });
  },
  // 获取编辑删除状态
  getSaveHidden: function () {
    const saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  // 获取选中商品的金额
  getTotalPrice: function () {
    const { shoppingList } = this.data;
    let totalPrice = 0;
    for(let i =0;i<shoppingList.length;i++) {
      if(shoppingList[i].select) {
        totalPrice += shoppingList[i].price * shoppingList[i].quantity;
      }
    }
    totalPrice = totalPrice.toFixed(2);
    return totalPrice;
  },
  // 获取是否全选
  getAllSelect: function () {
    const { shoppingList } = this.data;
    let allSelect = false;
    for(let i= 0;i<shoppingList.length;i++) {
      if (shoppingList[i].select) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  //重置商品列表
  setGoodsList: function ( saveHidden , totalPirce , allSelect ) {
    this.setData({
      saveHidden,
      totalPirce,
      allSelect
    });
  },
   /* 生命周期函数--监听页面初次渲染完成
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
    this.getShoppingList();
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