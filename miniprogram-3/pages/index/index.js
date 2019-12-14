//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
var product_arr = []
Page({
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    products:[],
    pirze_info:"none"
  },
  onLoad: function () {
    var obj = this;
    db.collection("products").orderBy('Probability', 'asc').get({
      success: function (res) {
        product_arr = res['data']
        obj.setData({
          products: res['data']
        })
      },
      fail: console.error
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        pirze_info: "block"
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          pirze_info: "block"
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            pirze_info: "block"
          })
        }
      })
    }
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      pirze_info: "block"
    })
  },
  addproduct:function(e){
    var pro = { "pro_name": "我要抽检的商品哟", "Probability": 20, "pro_num": 20, "pro_image": "../image/31.jpg","pro_depict":"一等奖哦"};
    db.collection("products").add({
      data: pro,
      success: function (res) {
        console.log(res);
      },
      fail: console.error
    })
  },
  prize:function(){
    this.randprize(product_arr);
  },
  randprize:function(arr){
    var prizeList = [];
    var len = arr.length;
    for (var i=0;i<len;i++){
      var pro = arr[i];
      var radio = parseInt(pro.Probability);
      for(var k=0;k<radio;k++){
        prizeList.push(pro);
      }
    }
    var prize_index = Math.floor(Math.random() * Math.floor(prizeList.length));
    console.log(prizeList)
    console.log(prize_index);
    console.log(prizeList[prize_index]);
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 500,
      viewHeight = 500 / ratio; 
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  }
})