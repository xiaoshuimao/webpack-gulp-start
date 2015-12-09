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
		console.log(data)
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
});