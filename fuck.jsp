<%@ page contentType="text/html; charset=GBK" %>
<%@ include file="/jsp/pub/pathHelper.jsp"%>
<!DOCTYPE html>
<%@ include file="/themes/chebaba/wxlogin.jsp" %>
<html>

<head>
	<meta charset="GBK">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<title></title>
	<script src="${CONTEXT}/topic/201511/public/pub/jquery.min.js"></script>
</head>

<body>
	<style>
		body{
			background-color: #eee;
		}
		.fuckyou{
			 position: absolute;
  width: 200px;
  height: 100px;
  text-align: center;
  padding: 33px 14px 0;
  top: -30px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
  border-radius: 5px;
  word-break: break-all;
  box-shadow: -4px 2px 9px #ddd;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
		}
	</style>
	<div class="fuckyou">
		正在调用微信支付，感谢您的耐心等待...
	</div>
	<script>
		function getQuery(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		}
		function detectWeixinApi(callback){
				if(typeof window.WeixinJSBridge == 'undefined' || typeof window.WeixinJSBridge.invoke == 'undefined'){
						setTimeout(function(){
								detectWeixinApi(callback);
						},200);
				}else{
						callback();
				}
		}
		var api = '${CONTEXT}/themes/chebaba/WCPay/jsapi2.jsp';
		var orderId = getQuery('orderId');
		var _appId, _timeStamp, _nonceStr, _package, _paySign = '';
		$.getJSON(api, { orderId: orderId, openId: openId }, function (data) {
			_appId = data.appId;
			_timeStamp = data.timeStamp;
			_nonceStr = data.nonceStr;
			_package = data.package_;
			_paySign = data.paySign;
			detectWeixinApi(function(){
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId": _appId, "timeStamp": _timeStamp, "nonceStr": _nonceStr, "package": _package, "signType": "MD5", "paySign": _paySign
				}, function (res) {
						//get_brand_wcpay_request:fail 
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							alert("支付成功，正在返回...")
							history.back(-1);					
						} else if(res.err_msg = "get_brand_wcpay_request:cancel"){
							alert("您取消了支付，请前往 m.chebaba.com 登录个人中心，支付未付款订单。")
							history.back(-1);
						}else{
							alert(res.err_msg);
							history.back(-1);
						}
						
				});
			});
			});
	</script>
</body>

</html>