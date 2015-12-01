require('./main.less');
import $ from 'jq';
import {getQuery, isWx} from 'func';
import {joincount_xk, joincount_lan, joincount_lou,awardlist} from 'api';

$(function(){
  //
  $.ajax({
    data:{},
    url:joincount_xk,
    dataType:'json',
    type:'post'
  }).done(function(data){
    if(!~~data.error){
      $('.j-xk').text(data.count);
    }
  }).fail(function(a,b, c){
    console.log(a+'////'+b+'////'+c);
  });
  //
  $.ajax({
    data:{},
    url:joincount_xk,
    
    dataType:'json',
    type:'post'
  }).done(function(data){
    if(!~~data.error){
      $('.j-lan').text(data.count);
    }
  }).fail(function(a,b, c){
    console.log(a+'////'+b+'////'+c);
  });
  //
  $.ajax({
    data:{},
    url:joincount_lan,
    dataType:'json',
    type:'post'
  }).done(function(data){
    if(!~~data.error){
      $('.j-lou').text(data.count);
    }
  }).fail(function(a,b, c){
    console.log(a+'////'+b+'////'+c);
  });
  //
  $.ajax({
    data:{},
    url:awardlist,
    dataType:'json',
    type:'post'
  }).done(function(data){
    if(!~~data.error){
      //$('#message ').
      var html = '';
      $.each(data.data,function(index,itm){
        if(itm.carSeriesId=='353861' || itm.carSeriesId=='50001') {
          var phone = itm.phone.substring(0,3)+"***"+itm.phone.substring(8,11);
          html += '<p><i class="icon_lb"></i>转个身，<span>三年十万公里免保劵</span>礼品就被 <span>'+phone+'</span></p>\
            <p>抽走了，眼红不如行动！</p>';
        }
        if(itm.carSeriesId=='353861'){
          var phone = itm.phone.substring(0,3)+"***"+itm.phone.substring(8,11);
          html += '<p><i class="icon_lb"></i>转个身，<span>50%购置税补贴券</span>礼品就被 <span>'+phone+'</span></p>\
            <p>抽走了，眼红不如行动！</p>';
        }
      });
      $('#message ').append(html);
    }
  }).fail(function(a,b, c){
    console.log(a+'////'+b+'////'+c);
  });

  var hei = $('.action').innerHeight();
  console.log(hei)
  $(window).scroll(function(){
    //console.log(hei)
   var  top = $(document.body).scrollTop();
    if(top >= hei){
      $('.car_nav').addClass('car_nav_fix');
    }else{
      $('.car_nav').removeClass('car_nav_fix');
    }
  });
  var smart = getQuery('smartcode');
  if(isWx){
    $('.j-get').attr('href','http://weixin.dongfeng-nissan.com.cn/huodong/index.php?a=DoubleTwelve&m=index&key=N-Weixin-Wap-V4-Ac-Le-PoC-Msg2-02-20151201-1212');
    if(typeof(smart)!= undefined && smart != null) {
      $('.j-get').attr('href','http://weixin.dongfeng-nissan.com.cn/huodong/index.php?a=DoubleTwelve&m=index&key=N-Weixin-Wap-V4-Ac-Le-PoC-Msg2-02-20151201-1212&smartCode='+smart);
    }
  }else {
      $('.j-get').attr('href','http://weixin.dongfeng-nissan.com.cn/huodong/index.php?a=DoubleTwelve&m=index&key=N-Chebaba-Wap-V4-Ac-Le-PoC-Msg30-01-20151201-1212');
    if(typeof(smart)!= undefined && smart != null) {
      $('.j-get').attr('href','http://weixin.dongfeng-nissan.com.cn/huodong/index.php?a=DoubleTwelve&m=index&key=N-Weixin-Wap-V4-Ac-Le-PoC-Msg2-02-20151201-1212&smartCode='+smart);
    }
  }



});
