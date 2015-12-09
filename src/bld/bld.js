require('./bld.less');
import $ from 'jq';
import {smq, isWx, textScroll} from 'func';
import car from './car';
import {clue_api, vcode_api, vcode_ck_api, act_api, act_ckPhone_api} from 'api';
let layer = require('layer');
//用 layer 搞一个消息提示
let msg = (type = '', text, time = 1.5, shadeClose = false) => {
	layer.open({
		content: '<div class="' + type + '">' + text + '</div>',
		time: time,
		shadeClose: shadeClose
	});
}


$(function () {
	textScroll('act-list');
	//获取当前城市
	let city = null;
	let cbbMap = require('map');
	let map = new cbbMap();
	map.getCurPos(function (p) {
		map.getAddressByPos(p, function (d) {
			city = d.city || '北京';
			console.log(city);
			$('#tg_city option').each(function (i, o) {
				if (o.text == city) {
					$('#tg_city').val(o.value);
					showTgStore(o.value);
				}
			})
		});
	})
	//活动信息
	$.ajax({
		url: act_api,
		data: {
			activityId: 2333,
			topCount:10
		},
		type: 'post',
		dataType: 'json'
		}).done(function (d) {
		let count = d.count;
		$('#all-count').text(count);
		$.each(d.data, function (i, o) {
			$('#act-list .wrap').append('<span>' + o.name + ' ' + o.phone + '</span>')
		});
		}).fail(function (err) {
		msg('no', '不能获取活动参与人数');
		})
	//团购 城市 ---> 经销商
	$('#tg_city').change(function () {
		let cityid = $(this).val();
		showTgStore(cityid);
	});
	function showTgStore(cityid) {
		console.log(car.getDealer(cityid));
		let store = car.getDealer(cityid);
		$('#tg_store option').text(store.name).val(store.id).data('model', store.carmodel);
	}
	
  // 弹出团购表单
	$('#btn-tuan').click(function () {
		if ($('#tg_store').val() == 0) {
			msg('no', '请先选择城市和经销商');
			return;
		}
		let tgLayer = layer.open({
			type: 1,
			content: require('form_bld_tg.html'),
			style: "width:90%;border-radius:6px;",
			success: function () {
				$('html,body').addClass('lock');
				//团购  经销商 ----> 车系
				let model = $('#tg_store option').data('model');
				let options = car.getModel(model);
				$('#tg_carSeries').html(options);

				$('#yes').click(function () {
					checkForm('tg');
				});
			},
			end: function () {
				$('html,body').removeClass('lock');
				document.body.scrollTop = $('#t3').offset().top + 100;
			}
		});
	});
	//end 弹出团购表单
	//验证表单
	function checkForm(name) {
		var carSeriesId = '', storeId = '', pageId = '';
		if (name == 'tg') {
			carSeriesId = $('#tg_carSeries').val();
			storeId = $('#tg_store').val();
			pageId = 'tg-xxxx'
		}

		var name = $('#name').val();
		var phone = $('#phone').val();
		var vcode = $('#vcode').val();
		if (!name) {
			msg("no", "请输入姓名")
			return false;
		}
		if (!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
			msg("no", "请输入正确的手机号码");
			return false;
		}
		if (!vcode) {
			msg("no", "请输入验证码");
			return false;
		}
		if (!tg_carSeries) {
			msg('no', "请选择车系");
			return false;
		}
		if (!tg_store) {
			msg("no", "请选择专营店");
			return false;
		}

		let code = {
			phone: phone,
			code: vcode
		}
		$.ajax({
			url: vcode_ck_api,
			data: code,
			type: 'post',
			dataType: 'json',
			success: function (data) {
				if (!~~data.error) {
					doClue({
						name: encodeURIComponent(name),
						phone: phone,
						storeId: storeId,
						carSeriesId: carSeriesId,
						pageId: pageId
					});
				} else {
					msg("no", data.errMsg);
				}
			}
		});
	}
	//end 验证表单
	//提交线索
	function doClue(clue) {
		let _clue = {
			authKey: 'abc123!!',
			actionType: 'saveclue',
			source: isWx ? '15' : '17',
			activityName: encodeURIComponent('12月堡垒店专题活动'),
			clueType: 6,
			activityId: 2333
		}
		$.extend(clue, _clue);
		$.ajax({
			url: clue_api,
			data: clue,
			type: 'post',
			dataType: 'json'
		}).done(function (d) {
			//_smq.push(['custom', '1yuan5-WAP-lead-1', '', form.phone]);
			msg('yes', '提交成功');
			layer.close(tgLayer);
		}).fail(function (err) {
			msg('no', '留资失败');
		})
	}
	//end 提交线索
	
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
	});
	// END 获取验证码
});