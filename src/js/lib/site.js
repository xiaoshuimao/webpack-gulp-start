 (function() {
   var WebP = new Image();
   WebP.onload = WebP.onerror = function() {
     if (WebP.height != 2) {
       // var sc = document.createElement('script');
       // sc.type = 'text/javascript';
       // sc.async = true;
       // var s = document.getElementsByTagName('script')[0];
       // sc.src = 'js/webpjs-0.0.2.min.js';
       // s.parentNode.insertBefore(sc, s);
       require('webpjs');
     }
   };
   WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
 })();



 /* 接口地址 */
 var proName = '';
 var Apiurl = {
   clue: proName + '/ajax/leaveInfo/cbbLeaveInfo.do',
   zc: proName + "/oneyuan.htm?action=loadActivityInfo",
   r30: proName + "/oneyuan.htm?action=loadR30ActivityInfo",
   submitPay: proName + "/oneyuan.htm?action=saveOrder",
   r30Pay: proName + "/oneyuan.htm?action=saveR30Order",
   vcode: proName + "/oneyuan.htm?action=getVcode",
   vfan: proName + "/oneyuan.htm?action=getOrderFans",
   r30fan: proName + "/oneyuan.htm?action=getOrderR30Fans",
   urlCity: proName + "/oneyuan.htm?action=loadAllCity",
   urlStore: proName + '/web/activity/activitySearch.do?actionType=wapdealerbycity',
   carType: proName + '/oneyuan.htm?action=loadAllCarType'
 }

 /* UI组件 */
 var UI = {}
 var Pub = {
   // 截取url参数
   getQuery: function(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
   },
   isWx: function() {
     var ua = window.navigator.userAgent.toLowerCase();
     if (ua.match(/MicroMessenger/i) == 'micromessenger') {
       return true;
     } else {
       return false;
     }
   }
 }

 var zc_phone = JSON.parse(window.localStorage.getItem('zc_phone')) || '';
 if (Pub.isWx()) {
   //微信分享代码
   $.ajax({
     type: "get",
     url: "http://weixin.dongfeng-nissan.com.cn/api.php?a=WeiXin&m=ajaxDomainShare",
     dataType: "jsonp",
     jsonp: "callback",
     jsonpCallback: "success",
     success: function(data) {
       // alert(JSON.stringify(data));
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

 }

 function shareWeixin(title, imgUrl, desc, link) {
   //var title = '我参加了“一元夺蓝鸟”活动，快来接力吧！';
   wx.ready(function() {
     if (zc_phone) {
       var param = '?guideId=' + zc_phone;
     }
     link = link + param;
     // var imgUrl = 'http://weixin.dongfeng-nissan.com.cn/huodong/Public/bulebird_share_icon.jpg';
     //var desc = '一元夺蓝鸟活动';
     //分享到朋友圈
     wx.onMenuShareTimeline({
       title: title, // 分享标题
       link: link, // 分享链接
       imgUrl: imgUrl, // 分享图标
       success: function() {
         // 用户确认分享后执行的回调函数
         //alert('分享成功!');
       },
       cancel: function() {
         // 用户取消分享后执行的回调函数1
         //alert('取消成功');
       }
     });

     //分享给朋友
     wx.onMenuShareAppMessage({
       title: title, // 分享标题
       desc: desc, // 分享描述
       link: link, // 分享链接
       imgUrl: imgUrl, // 分享图标
       type: '', // 分享类型,music、video或link，不填默认为link
       dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
       success: function() {
         // 用户确认分享后执行的回调函数
         //alert('分享成功!');
       },
       cancel: function() {
         // 用户取消分享后执行的回调函数
         //alert('取消成功');
       }
     });

     //分享到QQ
     wx.onMenuShareQQ({
       title: title, // 分享标题
       desc: desc, // 分享描述
       link: link, // 分享链接
       imgUrl: imgUrl, // 分享图标
       success: function() {
         // 用户确认分享后执行的回调函数
         //alert('ok');
       },
       cancel: function() {
         // 用户取消分享后执行的回调函数
       }
     });
   });
 }