require('./bc.less');
import {getQuery, isWx, formatTime} from 'func';
import $ from 'jq';
import {bl_picCity, bl_store, bl_gifType} from 'api';

$(function(){

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

	/*---车系图片及城市列表接口----*/
	function getPicCity(city){
		$.ajax({
			url: bl_picCity,
			type: 'post',
			dataType: 'json',
			data: {series_id: '24526'},
		})
		.done(function(data) {
			if(!$.isEmptyObject(data)){
				$('.j-img').attr('src', data.picture);
				var html ='';
				$.each(data.city,function(index, el) {
					html += '<option value="">'+itm.city_name+'</option>';
				});
				$('#sel1').html(html);
				var search = ':contains('+city+')';
				$('#sel1 option').filter(search).attr("selected",true)
			}
		})
		.fail(function() {
			msg('no', '初始化页面失败，请刷新页面');
		})
	}

	/*---经销商接口----*/
	function getStore(){
		$.ajax({
			url: bl_store,
			type: 'post',
			dataType: 'json',
			data: {series_id: '24526'},
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
	}

	/*---车型及礼品接口----*/
	function getGiftType(){
		$.ajax({
			url: bl_gifType,
			type: 'post',
			dataType: 'json',
			data: {series_id: '24526'},
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
	}
	

	/*--------初始化当前位置--------*/
	let cbbMap = require('map');
    function locationFunc() {
      var map = new cbbMap();
      var sf = map.getCurPos(function (d) {
        map.getAddressByPos(d, function (data) {
          var city = data.city;
          getPicCity(city);
        });
      });
    }
	locationFunc();
	//console.log($('#sel1 option').filter(':contains("汕头")').attr("selected",true));
});