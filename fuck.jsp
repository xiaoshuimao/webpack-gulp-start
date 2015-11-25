<%@ page contentType="text/html; charset=GBK" %>
<%@ include file="/jsp/pub/pathHelper.jsp"%>
<!DOCTYPE html>
<%@ include file="/themes/chebaba/wxlogin.jsp" %>
<html>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<title></title>
	<script src="http://cdn.bootcss.com/jquery/3.0.0-alpha1/jquery.min.js"></script>
</head>

<body>
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
		$.get(api, { orderId: orderId, openId: openId }, function (data) {
			_appId = data.appId;
			_timeStamp = data.timeStamp;
			_nonceStr = data.nonceStr;
			_package = data.package_;
			_paySign = data.paySign;
			detectWeixinApi(function(){
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId": _appId, "timeStamp": _timeStamp, "nonceStr": _nonceStr, "package": _package, "signType": "MD5", "paySign": _paySign
				}, function (res) {
						alert(res.err_msg);
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							alert('成功');
						} else {
							alert('失败');
							alert(res.err_msg);
						}
						history.back(-1);
				});
			}, "json");
			});
	</script>
</body>

</html>