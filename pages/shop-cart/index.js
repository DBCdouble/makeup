var app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoppingList:[],
    allSelect:false,//控制全选按钮的图片切换
    noSelect: true,//是否有商品选中，控制显示隐藏商品总价格和未选择商品点击删除结算的提示
    totalPrice:"0.00",//选中商品总价格
    saveHidden:true,//编辑完成的按钮切换
    delBtnWidth:120,//每个商品的删除按钮
    alertShow:false,//提示框组件的显示隐藏
    alertText: "" //提示框组件的文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShoppingList();
  },
  getShoppingList: function () {
    const { id } = wx.getStorageSync("userInfo").user;
    utils.http(app.globalData.baseUrl + '/v1.4/user/shopping?appTab=2&appkey=' + app.globalData.appkey + "&userId="+id+"&type=b2c", "GET", (data)=>{
      wx.setTabBarBadge({
        index: 2,
        text: String(data.data.total),
      })
      data.data.shoppingList.map(item =>{
        item.select = false;
      });
      this.setGoodsList(true, "0.00", false, true, data.data.shoppingList);
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
    this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);
  },
  // 完成或者编辑
  edit: function () {
    let { saveHidden } = this.data;
    this.setData({
      saveHidden: !saveHidden
    });
  },
  // 单个商品勾选
  selectChange: function (event) {
    const { index } = event.target.dataset;
    let { shoppingList } = this.data;
    shoppingList[index].select = !shoppingList[index].select;
    this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);
  },
  //全选
  allSelectChange: function () {
    let { shoppingList , allSelect } = this.data;
    shoppingList.map(item=>{
      item.select = !allSelect;
    })
    this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);
  },
  acounts: function () {
    let time;
    clearTimeout(time);
    const { noSelect } = this.data;
    if (!noSelect) {

    }else {
      this.setData({
        alertShow : true,
        alertText:"请先选择您的商品！"
      });
      time = setTimeout(()=>{
        this.setData({
          alertShow: false
        });
      },1000);
    }
  },
  deleteAll: function () {
    let time;
    clearTimeout(time);
    const { noSelect } = this.data;
    if (!noSelect) {
      let { shoppingList } = this.data;
      let list = [];
      for (let i = 0; i < shoppingList.length; i++) {
        if (!shoppingList[i].select) {
          list.push(shoppingList[i]);
        }
      }
      this.setData({
        shoppingList:list
      },()=>{
        this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
      });
    } else {
      this.setData({
        alertShow: true,
        alertText: "请先选择您的商品！"
      });
      time = setTimeout(() => {
        this.setData({
          alertShow: false
        });
      }, 1000);
    }
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
    this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);
  },
  // 获取编辑删除状态
  getSaveHidden: function () {
    const saveHidden = this.data.saveHidden;
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
  //判断是否有勾选
  getNoSelect: function () {
    const { shoppingList } = this.data;
    let noSelect = 0;
    for(let i=0;i<shoppingList.length;i++) {
      if(!shoppingList[i].select) {
        noSelect++;
      }
    }
    if(noSelect == shoppingList.length) {
      return true;
    }else {
      return false;
    }
  },
  //重置商品列表
  setGoodsList: function (saveHidden, totalPrice, allSelect, noSelect, shoppingList) {
    this.setData({
      saveHidden,
      totalPrice,
      allSelect,
      noSelect,
      shoppingList
    });
  },
  //滑动开始事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  //滑动移动事件
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0rpx";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "rpx";
        }
      }
      var shoppingList = this.data.shoppingList;
      if (index != "" && index != null) {
        shoppingList[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);
      }
    }
  },
  //滑动结束事件
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";
      var shoppingList = this.data.shoppingList;
      if (index !== "" && index != null) {
        shoppingList[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);

      }
    }
  },
  deleteItem: function (event) {
    const { index } = event.target.dataset;
    let { shoppingList } = this.data;
    shoppingList.splice( index, 1);
    this.setGoodsList(this.getSaveHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shoppingList);
  },
  //点击商品图片进入商品详情
  toDetail: function (event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url:'/pages/goods-details/index?id='+id
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
    const { shoppingList } = this.data;
    shoppingList.map(item => {
      item.select = false;
    });
    this.setGoodsList(true, "0.00", false, true, shoppingList);
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