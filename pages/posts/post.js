var postsData = require('../../data/posts-data.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
    bannerList:[],
    templateList:[],
    topList:[]
  },
  onLoad: function () {
   this.homeRequest();
   this.topListRequest(12);
  },
  homeRequest: function () {
    console.time("首页模块请求时间");
    util.http(app.globalData.baseUrl + "/home?appkey=" + app.globalData.appkey, 'GET', (data) => {
      this.setData({
        postList: postsData.postList,
        bannerList: data.home.banners,
        templateList: data.home.templates
      });
      console.timeEnd("首页模块请求时间");
    });
  },
  topListRequest: function (num) {
    console.time("热卖商品列表请求时间");
    util.http(app.globalData.baseUrl + "/top/goodsList?appkey=" + app.globalData.appkey +"&num="+num, 'GET', (data) => {
      this.setData({
        topList: data.data
      });
      console.timeEnd("热卖商品列表请求时间");
    });
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: '/pages/goods-details/index?id='+e.currentTarget.dataset.id,
    })
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },
  onReachBottom: function () {
    const { topList } = this.data;
    if ( topList.length != 0) {
      this.topListRequest(topList.length+12);
    }
  },
  onPullDownRefresh: function () {
    const { topList } = this.data;
    this.homeRequest();
    this.topListRequest(topList.length>0?topList.length:12);
  },
  // 点击搜索框弹出搜索页面
  openSearch: function (event) {
    
  }
  // onSwiperTap: function (event) {
  //   // target 和currentTarget
  //   // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
  //   // target这里指的是image，而currentTarget指的是swiper
  //   var postId = event.target.dataset.postid;
  //   wx.navigateTo({
  //     url: "post-detail/post-detail?id=" + postId
  //   })
  // }
})