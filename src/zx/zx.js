require('./zx.less');
require('jq');
require('site')
require('select');


$(function() {
  function nextPage(i) {
    $('.zx__page').removeClass('zx__page--cur').eq(i).addClass('zx__page--cur');
  }

  / /
  获取车型
  $('#product_id').carSelect({
    url: '/oneyuan.htm?action=loadAllCarType',
    title: ['请选择品牌', '请选择车系', '请选择车型'],
    vel: 3,
    sign: 'brand',
    callback: function(eve) {
      $('#product_id').text(eve.text()).css('color', '#666');
      $('#carTypeId').val(eve.data('id'));
      $('#dealer').show();
      var cityid = getCookie('mycityid');
      if (!cityid) {
        cityid = '20305';
      }
      getDealer(cityid, eve.data('id'));
    }
  });
  //获取cookie
  //获取经销商
  function getCookie(cookie_name)

  {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name); //索引的长度  
    if (cookie_pos != -1) {
      cookie_pos += cookie_name.length + 1;
      var cookie_end = allcookies.indexOf(";", cookie_pos);
      if (cookie_end == -1) {
        cookie_end = allcookies.length;

      }
      var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了。。。    
    }
    return value;

  }

  function getDealer(cityid, carid) {
    var dealer = {
      cityId: cityid,
      carTypeId: carid
    }
    $.ajax({
      url: '../../ajax/bg/carActivity/getCarTypeList.do?actionType=getdlr',
      data: dealer,
      dataType: 'json',
      type: 'post',
      success: function(data) {
        console.log(data);
        $('#dealer option').not(':eq(0)').remove();
        var html = '';
        $.each(data.dlrs, function(index, itm) {
          var price = ((itm[2] * 1) / 10000).toFixed(2) + '万';
          html += '<option data-price="' + itm[2] + '" value="' + itm[1] + '">' + itm[0] + ' ' + price + '</option>'
        });
        $('#dealer option').eq(0).after(html);

      },
      error: function(x, y, z) {
        console.log(x + '////' + y + '////' + z);
      }
    });
  }
  $('#dealer').change(function() {
    $('#offer_price').val($('#dealer option:checked').data('price'));
    console.log($('#offer_price').val())
  })
  //首屏发送手机验证码
  $('.js__vcode').click(function() {
    var phone = $('#loan_phone').val();
    var phoneReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
    if (phoneReg == false) {
      alert('请输入正确的手机号码');
    } else {
      $('.js__vcode').hide();
      $.ajax({
        type: "post",
        url: "/oneyuan.htm?action=getVcode",
        data: {
          'phone': phone
        },
        dataType: "json",
        success: function(d) {
          if (!~~d.error) {
            $('.js__timeout').show().find('span').text('60');
            var clock = function() {
              setTimeout(counter, 1000);
            }
            clock();

            function counter() {
              var time = $('.js__timeout span').text() * 1 - 1;
              $('.js__timeout span').text(time);
              if (time > 0) {
                clock();
                return;
              }
              $('.js__timeout').hide();
              $('.js__vcode').show();
            }
          } else {
            alert(d.errMsg);
            $('.js__timeout').show();
          }
        },
        error: function() {
          alert('网络不给力，请重新点击获取验证码试试');
          $('.js__timeout').show();
        }
      });
    }
  });

  //金融产品数据接口交互--二平
  //获取借口数据
  $.ajax({
    url: '../../ajax/bg/carActivity/getCarTypeList.do?actionType=getskuvo',
    dataType: 'json',
    type: 'post',
    success: function(data) {
      $('#firstPay,#years').change(function() {
        var html = '';
        $(this).children('option[value=0]').remove();
        var firstpay = parseInt($('#firstPay').val());
        var year = parseInt($('#years').val())
        console.log(firstpay + '///' + year);
        if (firstpay && year) {
          //alert(1)
          $('#proType').show();
          $.each(data.skus, function(index, itm) {
            $('#product option').not(':eq(0)').remove();
            if (itm.proFirstPayPercent == firstpay && itm.skuItem == year) {
              html += '<option value="';
              html += itm.skuItem + ',,' + itm.proFirstPayPercent + ',,' + itm.skuId + ',,' + itm.skuRate + ',,' + itm.financialProId + ',,' + itm.financialProName + '">' + itm.financialProName + '</option>';
              //skuId+“,,”+skuRate+“,,”+financialProId+“,,”+financialProName
            }
          });
          $('#product option').eq(0).after(html);
        }
      })
    },
    error: function(x, y, z) {
      console.log(x + '////' + y + '////' + z);
    }
  });
  //首屏表单验证
  $('.js__check-form--1').click(function() {
    checkPage1();
  });
  $('.js__check-form--2').click(function() {
    if (checkPage2()) {
      nextPage(2);
    }
  });
  $('.js__check-form--3').click(function() {
    if (checkPage3()) {
      $('.ui__mask').show();
      var _param = $("#loan_fast").serialize();
      $.ajax({
        url: "../../financialcredit.htm?type=loan",
        data: _param,
        type: "post",
        dataType: "json",
        success: function(data) {
          console.log(data);
          //alert(1)
          if (data.status == "success") {
            re_loan_id = data.result.split("|||")[0];
            setTimeout(function() {
              if (re_loan_id != -1) {
                //成功页面
                window.location.href = "/loanresult.htm?cluecode=" + re_loan_id;
              } else {
                //失败页面
                window.location.href = "/loanresult.htm?cluecode=" + re_loan_id;
              }
            }, 1000);
          } else {
            $(".ui__mask").hide();
            fail_url = data.msg;
          }
        }
      });
    }
  });
  $('.zx__btn--page2-1').click(function() {
    nextPage(0);
  })

  function checkPage1() {
    var loan_phone = $('#loan_phone').val(),
      loan_name = $('#loan_name').val(),
      product_id = $('#carTypeId').val(),
      loan_gender = $('#loan_gender').val(),
      vcode = $('#vcode').val(),
      dealer_id = $('#dealer_id').val(),
      offer_price = $('#offer_price').val();
    if (!loan_name) {
      alert("请输入姓名")
      return false;
    }
    if (!loan_gender) {
      alert("请选择性别");
    }
    if (!loan_phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
      alert("请输入正确的手机号码");
      return false;
    }
    if (!vcode) {
      alert("请输入验证码");
      return;
    }
    if (!product_id) {
      alert("请选择心仪车型");
      return false;
    }
    if (!dealer_id || !offer_price) {
      alert("请选择经销商");
      return false;
    }
    var code = {
      phone: loan_phone,
      code: vcode
    }
    $.post("/oneyuan.htm?action=checkCode", code, function(data) {
      if (!~~data.error) {
        $('#input_code').hide();
        nextPage(1);
      } else {
        alert(data.errMsg);
        return;
      }
    }, 'json');
  }
  //二屏验证
  function checkPage2() {
    var product = $('#product').val();
    if (!product) {
      alert('请选择产品类型');
      return false;
    }
    return true;
  }
  //三平验证
  function checkPage3() {
    var card_name = $('#card_name').val(),
      cardnum = $('#cardnum').val(),
      fangchan = $('#fangchan').val(),
      marry = $('#marry').val(),
      trade = $('#trade').val(),
      occupation = $('#occupation').val(),
      workyear = $('#workyear').val(),
      company = $('#company').val(),
      income = $('#income').val(),
      education = $('#education').val();

    if (!card_name) {
      alert('请选择证件类型');
      return false;
    }
    if (!cardnum) {
      alert('请输入证件号码');
      return false;
    }
    if (!fangchan) {
      alert('请选择房产类型');
      return false;
    }
    if (!marry) {
      alert('请选择婚姻状态');
      return false;
    }
    if (!trade) {
      alert('请选择行业类型');
      return false;
    }
    if (!occupation) {
      alert('请选择职业类型');
      return false;
    }
    if (!workyear) {
      alert('请输入工作年限');
      return false;
    }
    if (!company) {
      alert('请选择公司性质');
      return false;
    }
    if (!income) {
      alert('请输入月收入');
      return false;
    }
    if (!education) {
      alert('请选择您的学历类型');
      return false;
    }
    return true;
  }

});