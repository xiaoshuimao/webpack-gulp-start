require('./bld.less');
import $ from 'jq';
import {smq} from 'func';



$(function(){
	//获取当前城市
	let city = null;
	let cbbMap = require('map');
	let map = new cbbMap();
	map.getCurPos(function(p){
		map.getAddressByPos(p,function(d){
			city = d.city;
			console.log(city);
			$('#tg_city option').each(function(i,o){
				if(o.text==city){
					$('#tg_city').val(o.value);
				}
			})
			
		});
	})
	
	
	
	
	let layer = require('layer');
	//用 layer 搞一个消息提示
	let msg = (type = '', text, time = 1.5, shadeClose = false) => {
		layer.open({
			content: '<div class="' + type + '">' + text + '</div>',
			time: time,
			shadeClose: shadeClose
		});
	}
	$('#btn-tuan').click(function(){
		layer.open({
			type: 1,
			content: require('form_bld_tg.html'),
			style: "width:90%;border-radius:6px;",
			success: function () {
				$('html,body').addClass('lock');
			},
			end: function () {
				$('html,body').removeClass('lock');
				document.body.scrollTop = $('#t3').offset().top + 100;
			}
		});
	});
});