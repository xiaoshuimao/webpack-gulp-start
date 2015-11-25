import {wxpay_api} from 'api';
import $ from 'jq';

let doWxpay = function (orderId, openId, cb) {
	cb = cb || function () { msg('nothing callback...') };
	let _appId, _timeStamp, _nonceStr, _package, _paySign = '';
	$.get(wxpay_api, { orderId: orderId, openId: openId }, function (data) {
		_appId = data.appId;
		_timeStamp = data.timeStamp;
		_nonceStr = data.nonceStr;
		_package = data.package_;
		_paySign = data.paySign;
		WeixinJSBridge.invoke('getBrandWCPayRequest', {
			"appId": _appId, "timeStamp": _timeStamp, "nonceStr": _nonceStr, "package": _package, "signType": "MD5", "paySign": _paySign
		}, function (res) {
			msg(res.err_msg);
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				cb();
			} else {
				cb(res.err_msg);
			}
		});
	}, "json");
}

module.exports = doWxpay;