require('./bld.less');
import $ from 'jq';
import {smq} from 'func';
$(function(){
	var f=0;//历史位置
	var c=8;//基础圈数
	// var r=360;常量一圈的度数
	var n=7;//1-8奖项
	//逆时针依次为8,1,2,3,4,5,6,7
	var bonus=45*n;
	var on_color='#fff';
	var off_color='#ffd118';
	// var compensate=360-f;//补偿，不需要
	$('.go').on('click',function(){
		$('.ungo').show();
		var t=c*360+bonus;
			var str='@keyframes roundOver{'+
					'from {transform: rotate('+f+'deg);}'+
					'to {transform: rotate('+t+'deg);}'+
				'}';
		$('#goRound').html(str);
		$('.roundPad').addClass('gogogo');
		 f=bonus;
         // compensate=360-f;
         //按钮效果
         $('.btn_up').attr('src', './img/button_down.png');
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
		  // window.setTimeout(arguments.callee,200)
         },200);
		
	});
	//灯的位置
	(function(){
		for(var i=0;i<24;i++){
			var left=50;
			var top=0;
			left=50+50*Math.sin(i*15*Math.PI/180);
			top=50-50*Math.cos(i*15*Math.PI/180);
			var light='<li class="light" style="left:'+left+'%;top:'+top+'%;"'+'><i class="u-light"></i></li>';
			$('.lightBox').append(light);
		}
		
	})();
	//灯的亮灭
	function blingLight(){
		$('.u-light').each(function(index, el) {
			if(index%2==0){
				$(el).css({
					'box-shadow':'0px 0px 10px #888888',
					'background-color':on_color
				});
				window.setTimeout(function(){
				$(el).css({
					'box-shadow':'0px 0px 0px #888888',
					'background-color':off_color
					});
				},150);
			}else{
				$(el).css({
					'box-shadow':'0px 0px 0px #888888',
					'background-color':off_color
				});
				window.setTimeout(function(){
				$(el).css({
					'box-shadow':'0px 0px 10px #888888',
					'background-color':on_color
					});
				},150);

			}
		});
		
	}
	//全亮或全灭灯
	//s为bool值
	function lightSwitch (s) {
		if(s){
			$('.u-light').each(function(index, el) {
				$(el).css({
					'box-shadow':'0px 0px 10px #888888',
					'background-color':on_color
				});

			});
		}else{
			$('.u-light').each(function(index, el) {
				$(el).css({
					'box-shadow':'0px 0px 0px #888888',
					'background-color':off_color
				});

			});
		}
		
	}

	
});