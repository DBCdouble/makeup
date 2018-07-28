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
    console.log(e);
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      utils.http(app.globalData.baseUrl + '/login?phoneNum=18566184235&password=25F9E794323B453885F5181F1B624D0B&appTab=2&appkey=' + app.globalData.appkey, 'POST', (data) => {
        wx.setStorageSync('userInfo', data);
        wx.switchTab({
          url: "../posts/post"
        });
      });
    }else {
      wx.switchTab({
        url: "../posts/post"
      });
    }
  }
})