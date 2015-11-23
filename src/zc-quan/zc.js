require('./zc.less');
import $ from 'jq';
import {getQuery} from 'func';
import {city_api, store_api} from 'api';
require('store_choose');
let layer = require('layer');


$(function () {
	//活动解读按钮
	$('.banner .btn').click(function () {
		layer.open({
			type: 1,
			content: require('./rule.html'),
			style: "width:90%;height:80%;overflow:auto;border-radius:5px;"
		})
	});
	//一元夺券按钮
	var type = 1, car = '';
	$('.floor .btn').click(function () {
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

})
