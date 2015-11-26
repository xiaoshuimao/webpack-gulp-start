//微信分享代码
import {addjs} from 'func';
import $ from 'jq';
let share = (title = document.title, imgUrl = null, desc = null, link = location.href) => {
  addjs('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function () {
    $.ajax({
      type: "get",
      url: "http://weixin.dongfeng-nissan.com.cn/api.php?a=WeiXin&m=ajaxDomainShare",
      dataType: "jsonp",
      jsonp: "callback",
      jsonpCallback: "success",
      success: function (data) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'getLocation'
          ]
        });
      }
    });
    wx.ready(function () {
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        desc: desc,
        success: function () {
        },
        cancel: function () {
        }
      });
      //分享给朋友
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
        },
        cancel: function () {
        }
      });
      //分享到QQ
      wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
        },
        cancel: function () {
        }
      });
    });
  })
}

module.exports = share;