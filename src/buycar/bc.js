require('./bc.less');
import {getQuery, isWx, formatTime} from 'func';
import $ from 'jq';
import {bl_picCity, bl_store, bl_gifType} from 'api';

$(function(){
	$.ajax({
		url: bl_picCity,
		type: 'post',
		dataType: 'json',
		data: {series_id: '24526'},
	})
	.done(function(data) {
		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	/*--------初始化当前位置--------*/
	let cbbMap = require('map');
    function locationFunc() {
      var map = new cbbMap();
      var sf = map.getCurPos(function (d) {
        map.getAddressByPos(d, function (data) {
          //console.log(data);
          lng = d.lng;
          lat = d.lat;
          $('.place-msg span').html(data.address);
          myProvVar = data.province;
          mycityVar = data.city;
          var str = myProvVar + " " + mycityVar;
          $('.search-select__type-sel').text(str);
          InitProCity();
        });
      });
    }
	
});