var app = getApp();
var utils = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
Page({
  // onTap: function (event) {
  //   wx.switchTab({
  //       url: "../posts/post"
  //   });
      
  // },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      return;
    }
    wx.switchTab({
      url: "../posts/post"
    });
    // utils.http(app.globalData.baseUrl + '/login?phoneNum=18566184235&password=' + md5.hex_md5(123456789).toUpperCase()+'&appTab=2&appkey='+app.globalData.appkey,'POST',(data)=>{
    //   console.log(data);
    // });
    wx.setStorageSync('userInfo', e.detail.userInfo);
  }
})