import {getQuery, isWx, formatTime} from 'func';
//!getQuery('openId') && (location.href = 'http://dfldata-dev.dongfeng-nissan.com.cn/weixin/Nissan/www/api.php?a=E4S&m=userOauth&url=' + location.href);
require('./zc.less');
import $ from 'jq';
import {city_api, store_api, zc_pay12, zc_count12, clue_api, vcode_api} from 'api';
if(isWx){
	window.location.href='http://weixin.dongfeng-nissan.com.cn/huodong/index.php?a=OneYuan&m=index';
}
$(function () {

	//留资变量
	let flag  = true
	//引入弹框插件
	let layer = require('layer');
	//用 layer 搞一个消息提示
	let msg = (type = '', text, time = 1.5, shadeClose = false) => {
		layer.open({
			content: '<div class="' + type + '">' + text + '</div>',
			time: time,
			shadeClose: shadeClose
		});
	}
	
	//活动数据
    if (isWx) {
		$.ajax({
			url: zc_count12,
			dataType: 'json',
			type: 'post',
			data: {},
		}).done(function (d) {
			let act = isWx ? d.wx : d.tmail;
			act = act.split(',');
			act.pop();
			$.each(act, function (idx, item) {
				$('.j-have').eq(idx).text(item);
				$('.bar').eq(idx).find('span').css('width', item * 100 / 399 + '%');
				$('.process').eq(idx).find('.quan span').text(Math.floor(item / 399));
			});

		}).fail(function (state, err, c) {
			msg('no', '初始化页面失败，请刷新页面');
		});
	} else {
		$.ajax({
			url:'http://121.41.173.5/webservice/limited_buy.php?act=rush_purchase&type=2',
			dataType:'json',
			type:'get'
		}).done(function(d){
			if(d.error == '0' && d.mess == 'ok'){
				$.each(d.data, function(i, item){
					let li = $('[data-car="' + item.series_id + '"]').parents('li');
					li.find('.j-have').text(item.inventory);
					li.find('.bar span').css('width', item.inventory * 100 / 399 + '%');
					li.find('.quan span').text(Math.floor(item.inventory / 399));
				});
			}else{
				msg('no', d.mess);
			}
		}).fail(function(){
			msg('no', '初始化页面失败，请刷新页面');
		})
	}
	
	
	//倒计时
	let leftSec = new Date('2015/12/18 10:00:00') - new Date();
	let time = formatTime(leftSec);
	setInterval(function () {
		leftSec -= 1000;
		time = formatTime(leftSec);
		$('.j-d').text(time.d);
		$('.j-h').text(time.h);
		$('.j-m').text(time.m);
		$('.j-s').text(time.s);
	}, 1000);
	
	
	//布码
	$('.floor .btn').click(function () { type = $(this).data('type'); _smq.push(['custom', '1512-emption2-WAP', 'button' + type]); })

		//一元夺券按钮 微信端
		var type = 1, car = '', href = '';
		$('.floor .btn').click(function (e) {
		e.preventDefault();
		href = $(this).attr('href');
		type = $(this).data('type');
		car = $(this).data('car');
		layer.open({
			type: 1,
			content: require('form.html'),
			style: "width:90%;border-radius:6px;",
			success: function () {
				$('html,body').addClass('lock');
			},
			end: function () {
				$('.store-sel-wrap').remove();
				$('html,body').removeClass('lock');
			}
		});
		//选择经销商
		require('store/store_choose');
		$('.store').storeSelect({
			'placeUrl': city_api,
			'storeUrl': store_api + '&carBrandCode=1',
			'callback': function (eve) {
				var store = eve.find('.store-info-left__shop-name');
				var input = $('#storeId');
				input.text(store.text());
				input.data('storeid', store.data('storeid'));
			}
		});
		});
		//获取验证码
		$('body').on('click', '#getVcode', function () {
		var phone = $('#phone').val();
		var phoneReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
		if (phoneReg == false) {
			msg('no', '请输入正确的手机号码');
		} else {
			$('#getVcode').hide();
			$.ajax({
				url: vcode_api,
				data: { 'phone': phone },
				dataType: "json",
				success: function (d) {
					if (d.error == 0) {
						$('#timeVcode').show().find('span').text('60');
						var clock = function () {
							setTimeout(counter, 1000);
						}
						clock();
						function counter() {
							var time = $('#timeVcode span').text() * 1 - 1;
							$('#timeVcode span').text(time);
							if (time > 0) {
								clock();
								return;
							}
							$('#timeVcode').hide();
							$('#getVcode').show();
						}
					} else {
						msg('no', d.errMsg);
						$('#getVcode').show();
					}
				},
				error: function () {
					msg('no', '网络不给力，请重新点击获取验证码试试');
					$('#getVcode').show();
				}
			});
		}
		})
		//表单提交按钮
		$('body').on('click', '#yes', function () {
		submitForm();
		});
		//表单验证
		function submitForm() {
		var name = $('#name').val(),
			phone = $('#phone').val(),
			vcode = $('#vcode').val(),
			idcard = $('#idcard').val(),
			storeId = $('#storeId').data('storeid'),
			source = isWx ? '15' : '17';
		if (!name) {
			msg("no", "请输入您的姓名");
			return;
		}
		if (!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
			msg("no", "请输入正确的手机号码");
			return;
		}
		if (!vcode) {
			msg("no", "请输入验证码")
			return;
		}
		let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if (!idcard || (reg.test(idcard) === false)) {
			msg("no", "请输入正确的身份证号码");
			return false;
		}
		if (storeId == '') {
			msg('no', '请选择经销商');
			return;
		}
		let submitCover = layer.open({
			shadeClose: false,
			type: 2,
			content: isWx ? '正在为您跳转支付页面，请耐心等候支付页面加载...' : '正在跳转天猫，请在天猫下单抢购...'
		})
		var pageId = isWx ? 'N-Weixin-Wap-V4-Ac-Le-PoC-Msg6-03-0000' : 'N-Chebaba-Wap-V4-Ac-Le-PoC-Msg6-01-0000';
		if(flag){
			flag = false;
			doClue({
				name: encodeURIComponent(name),
				phone: phone,
				storeId: storeId,
				carSeriesId: car,
				authKey: 'abc123!!',
				actionType: 'saveclue',
				source: source,
				activityName: encodeURIComponent('一元夺券'),
				clueType: 6,
				pageId: pageId
			});
		}

		if (isWx) {
			doPay({
				name: encodeURIComponent(name),
				phone: phone,
				code: vcode,
				idcard: idcard,
				ctype: type,
				storeId: storeId
			});
		}	
			
		
		//调用支付接口
		//let wxPay = require('pay');
		function doPay(form) {
			$.ajax({
				url: zc_pay12,
				data: form,
				dataType: 'json',
				type: 'post'
			}).done(function (d) {
				layer.close(submitCover);
				if (d.error == 0) {
					location.href = CONFIG.CONTEXT_PATH + '/themes/chebaba/WCPay/fuck.jsp?orderId=' + d.data.orderId;
					/*支付改用fuck方式
					wxPay(d.data.orderId, openId, function (err) {
						if (!err) {
							msg('yes', '恭喜成功下单，请登录 m.chebaba.com 查看订单');
						}
					});
					*/
					//$('#fuck').attr('src', CONFIG.CONTEXT_PATH + '/themes/chebaba/WCPay/fuck.jsp?orderId=' + d.data.orderId);
					//$('#fuck').css('display','block');
				} else {
					msg('no', d.errMsg);
					if (d.errMsg.indexOf('个人中心') >= 0) {
						location.href = CONFIG.CONTEXT_PATH + '/member_wap.htm';
					}
				}

			}).fail(function (err) {
				msg('no', '参与人数过多，请刷新页面再试');
				location.reload();
			})
		}
		//调用留资接口
		function doClue(form) {
			$.ajax({
				url: clue_api,
				data: form,
				type: 'post',
				dataType: 'json'
			}).done(function (d) {
				_smq.push(['custom', '1512-emption2-WAP-lead-1', '', form.phone]);
				if (!isWx) {
					location.href = href;
				}
			}).fail(function (err) {
				msg('no', '留资失败');
			})
		}
		}
		//微信分享设置
		if (isWx) { require('share')("一元夺券，买车更优惠！", CONFIG.CONTEXT_PATH + '/topic/yydq/img/banner.png', '一元夺券', location.href.split('openId')[0]); }

});


