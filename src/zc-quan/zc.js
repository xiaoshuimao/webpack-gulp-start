require('./zc.less');
import $ from 'jq';
import {getQuery, isWx} from 'func';
import {city_api, store_api, zc_pay, zc_count} from 'api';


$(function () {
	//引入弹框插件
	let layer = require('layer');
	//活动数据
	let act = [];
	act = isWx ? d.wx : [80, 11, 1909, 22, 111, 180];
	$.each(act, function (idx, item) {
		$('.j-have').eq(idx).text(item);
		$('.bar').eq(idx).find('span').css('width', item * 100 / 299 + '%');
		$('.process').eq(idx).find('.quan span').text(Math.floor(item / 299));
	});
	$.ajax({
		url: zc_count,
		dataType: 'json',
		type: 'post',
		data: {},
	}).done(function (d) {
		act = isWx ? d.wx : [80, 11, 199, 22, 111, 180];
		$.each(act, function (idx, item) {
			$('.j-have').eq(idx).text(item);
		});
	}).fail(function (state, err, c) {

	});
	
	
	//活动解读按钮
	$('.banner .btn').click(function () {
		layer.open({
			type: 1,
			content: require('./rule.html'),
			style: "width:90%;height:80%;overflow:auto;border-radius:5px;"
		})
	});



	if (!isWx) {
		//一元夺券按钮 微信端
		var type = 1, car = '';
		$('.floor .btn').click(function (e) {
			e.preventDefault();
			type = $(this).data('type');
			car = $(this).data('car');
			console.log(car, type);
			layer.open({
				type: 1,
				content: require('form.html'),
				style: "width:90%;border-radius:6px;"
			});
		});
		
		
		//选择经销商
		require('store_choose');
		$('.store').storeSelect({
			'placeUrl': city_api,
			'storeUrl': store_api,
			'callback': function (eve) {
				var store = eve.find('.store-info-left__shop-name');
				var input = $('#storeId');
				input.text(store.text());
				input.data('storeid', store.data('storeid'));
			}
		});
		//表单验证
		function checkForm() {
			var name = $('#name').val(),
				phone = $('#phone').val(),
				vcode = $('#vcode').val(),
				idcard = $('#idcard').val(),
				storeId = $('#storeId').data('storeid'),
				source = isWx ? '15' : '17';

			if (!name) {
				alert("请输入姓名")
				return;
			}
			if (!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
				alert("请输入正确的手机号码");
				return;
			}
			if (!vcode) {
				alert("请输入验证码")
				return;
			}
			let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (!idcard || (reg.test(idcard) === false)) {
				alert("请输入正确的身份证号码");
				return false;
			}
			if (storeId == '') {
				alert('请选择经销商');
				return;
			}
			doClue({
				
			})
			doPay({
				name: name,
				phone:phone,
				code: vcode,
				idcard: idcard
			});
		}
		//调用支付接口
		function doClue(form){
			$.ajax({
				url:zc_pay,
				data: form,
				dataType: 'json',
			}).done(function(d){
				
			}).fail(function(err){
				console.log(err);
				alert('参与人数过多，请刷新页面再试');
				location.reload();
			})
		}
		//调用留资接口
		
	}

});
