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
    wx.setStorageSync('userInfo', e.detail.userInfo);
  }
})