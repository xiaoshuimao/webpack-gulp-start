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
	let formLayer = {};
	textScroll('act-list');
	//获取当前城市
	let city = null;
	let cbbMap = require('map');
	let map = new cbbMap();
	map.getCurPos(function (p) {
		map.getAddressByPos(p, function (d) {
			city = d.city || '北京';
			var search = ':contains(' + city + ')';
			console.log(search)
			$('#tg_city option').filter(search).attr("selected", true);
		});
	})
	//活动信息
	$.ajax({
		url: act_api,
		data: {
			activityId: 2333,
			topCount: 10
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
		formLayer = layer.open({
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
	// 弹出到店有礼表单
	$('#btn-book').click(function () {
		formLayer = layer.open({
			type: 1,
			content: require('form_bld_book.html'),
			style: "width:90%;border-radius:6px;",
			success: function () {
				$('html,body').addClass('lock');
				if (city) {
					var search = ':contains(' + city + ')';
					$('#book_city option').filter(search).attr("selected", true);
				}
				//团购  经销商 ----> 车系
				// let model = $('#tg_store option').data('model');
				// let options = car.getModel(model);
				// $('#tg_carSeries').html(options);
				$('#book_city').change(function () {
					let cityid = $(this).val();
					showBookStore(cityid);
				});
				function showBookStore(cityid) {
					let store = car.getDealer(cityid);
					$('#book_store option').text(store.name).val(store.id).data('model', store.carmodel);
				}
				let model = $('#book_store option').data('model');
				let options = car.getModel(model);
				$('#book_carSeries').html(options);
				$('#yes').click(function () {
					checkForm('book');
				});
			},
			end: function () {
				$('html,body').removeClass('lock');
				document.body.scrollTop = $('#t2').offset().top + 100;
			}
		});
	});
	
	//end 弹出到店有礼表单
	
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
			layer.close(formLayer);
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
	//当屏幕宽度改变时，获取.bitRound宽度，并设置其高为相同
	function changeScreen () {
		var h=$('.bigRound').width();
		$('.bigRound').height(h);
		h=$('.roundBorder').width();
		$('.roundBorder').height(h);
		$('.roundBorder').css({
			'border-radius': h
		});
		var w=$('.btn_up').width();
		var wt=$('.btn_text').width();
		var com=65/168;
		var sc=com*w/wt;
		var xc=(-1*w/2-wt/2);
		$('.btn_text').get(0).style.transform= 'translateX('+xc+'px)'+' '+'scale('+com*w/wt+','+com*w/wt+')';
	}
	changeScreen ();//声明后执行
	$(window).resize(function () {
		changeScreen ();
       	});
	// var inte={

	// };
	var f=0;//历史位置
	var on_color='#fff';//灯亮的颜色
	var off_color='#ffd118';//灯灭的颜色
	$('.go').on('click',function(){
		var c=8;//基础圈数
		// var r=360;常量一圈的度数
		var n=7;//1-8奖项
		//逆时针依次为8,1,2,3,4,5,6,7
		var bonus=45*n;
		$('.ungo').show();
		var t = c * 360 + bonus;
		var str = '@keyframes roundOver{' +
			'from {transform: rotate(' + f + 'deg);}' +
			'to {transform: rotate(' + t + 'deg);}' +
			'}';
		$('#goRound').html(str);
		$('.roundPad').addClass('gogogo');
		 f=bonus;
         //按钮效果
         $('.btn_up').attr('src', '');
         window.setTimeout(function(){
		 $('.btn_up').attr('src', './img/button_up.png');
         },150);
		window.setTimeout(function(){
         $('.roundPad').removeClass('gogogo');
         $('.roundPad').get(0).style.transform= 'rotate('+bonus+'deg)';
         		
        		bonus=45*n;
        		window.clearInterval(bl);
        		lightSwitch (false);
        		$('.ungo').hide();
        },8000);
    var bl=window.setInterval(function(){
		  blingLight();
         },200);
	});
	//灯的位置
	(function () {
		for (var i = 0; i < 24; i++) {
			var left = 50;
			var top = 0;
			left = 50 + 50 * Math.sin(i * 15 * Math.PI / 180);
			top = 50 - 50 * Math.cos(i * 15 * Math.PI / 180);
			var light = '<li class="light" style="left:' + left + '%;top:' + top + '%;"' + '><i class="u-light"></i></li>';
			$('.lightBox').append(light);
		}

	})();
	//灯的亮灭
	function blingLight() {
		$('.u-light').each(function (index, el) {
			if (index % 2 == 0) {
				$(el).css({
					'box-shadow': '0px 0px 10px #888888',
					'background-color': on_color
				});
				window.setTimeout(function () {
					$(el).css({
						'box-shadow': '0px 0px 0px #888888',
						'background-color': off_color
					});
				}, 150);
			} else {
				$(el).css({
					'box-shadow': '0px 0px 0px #888888',
					'background-color': off_color
				});
				window.setTimeout(function () {
					$(el).css({
						'box-shadow': '0px 0px 10px #888888',
						'background-color': on_color
					});
				}, 150);

			}
		});

	}
	//全亮或全灭灯
	//s为bool值 s为true全亮 false全灭
	function lightSwitch (s) {
		if(s){
			$('.u-light').each(function(index, el) {
				$(el).css({
					'box-shadow': '0px 0px 10px #888888',
					'background-color': on_color
				});

			});
		} else {
			$('.u-light').each(function (index, el) {
				$(el).css({
					'box-shadow': '0px 0px 0px #888888',
					'background-color': off_color
				});

			});
		}
	}

});