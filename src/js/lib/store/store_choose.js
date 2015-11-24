/**
 * Created by zxh on 2015/10/26.
 */
require('./store_choose.less');
import $ from 'jq';
let cbbMap = require('map');
(function ($) {
  $.fn.storeSelect = function (options) {

    var lng = 0;
    var lat = 0;
    var basePath = 'http://m.chebaba.com';
    var myProvVar = '';
    var mycityVar = '';

    var Default = {
      'html': '<div class="store-sel-wrap" style="z-index:1001;display:none;"><a href="#" class="store-sel__btn-close store-sel__btn-close1">X</a><div class="store-sel"> <div class="panel-block header"> <div class="search-select"> <div class="search-select__type-sel"></div> <i class="search-select__icon-down"></i></div><div class="place-msg" ><i class="place-msg__icon"></i> <label>当前位置:</label><span class="f-colorgra place-msg__current"></span> </div> </div></div></div>',
      'data': {},
      'param': {},
      'placeUrl': '',
      'storeUrl': '',
      'delStore': [],
      'callback': function (eve) { }
    };
    options = $.extend(Default, options);
    $('body').append(options.html);
    $(".store-sel__btn-close1").click(function () {
      $('.store-sel-wrap').hide();
      $('.popbox-choose').hide();
    });
    //点击弹出外层
    $(this).click(function () {
      if ($('.store-sel-wrap').length > 0) {
        $('.store-sel-wrap').show();
        return;
      }
      $('.store-sel-wrap').show();
    });
    locationFunc();
    /*--------初始化当前位置--------*/
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


    /*--------初始化省市--------*/
    function InitProCity() {
      $('.popbox-choose').remove();
      var chooseBox = '<div class="popbox-choose" style="z-index:12"> <div class="popbox-choose__header"> <em></em><i></i> </div> <div class="popbox-choose__cnt"> <div class="popbox-choose__cnt__left"> <ul class="popbox-choose__cnt__left__prov" style="font-size:12px"> </ul> </div> <div class="popbox-choose__cnt__right" style="font-size:12px"> <ul class="popbox-choose__cnt__right__city"> </ul> </div> </div></div>';
      //  $('.search-select').append(chooseBox);
      $('.store-sel-wrap').append(chooseBox);

      $('.search-select__type-sel,.search-select__icon-down').click(function () {
        $('.popbox-choose').toggle();
      });

      $('.popbox-choose').on('touchmove', function (e) {
        e.stopPropagation();
      });

      var url = options.placeUrl;
      $.post(url, function (data) {
        data = data.data;

        InitPro(data.privince);
        defaultProv(myProvVar);

        var defId = $(' [data-proname="' + myProvVar + '"]').data('proid');
        console.log(data[defId]);
        InitCity(data[defId]);
        defaultCity(mycityVar);

        clickProvEventLoad(data);
        clickCityeventLoad();
        clickStore();

      });

    }

    /*---------初始化省份----*/
    function InitPro(data) {
      var proHtml = '';
      $.each(data, function (index, itm) {
        proHtml += '<li data-proname="' + itm.name + '" data-proid="' + itm.id + '"class="popbox-choose__cnt__left__prov__itm">' + itm.name + '</li>';
      });
      $('.popbox-choose__cnt__left__prov').append(proHtml);
      $('.popbox-choose__cnt__left__prov').on('touchmove', function (e) {
        e.stopPropagation();
      });
    }

    function defaultProv(myProVar) {
      $(' [data-proname="' + myProVar + '"]').addClass('f-bgwith');
    }

    /*---------初始化城市-----*/
    function InitCity(data) {
      var cityHtml = '';
      $.each(data, function (index, itm) {
        cityHtml += '<li data-cityname="' + itm.name + '" data-cityid="' + itm.id + '"class="popbox-choose__cnt__right__city__itm">' + itm.name + '</li>';
      });
      $(cityHtml).appendTo('.popbox-choose__cnt__right__city').trigger('create');
      $('.popbox-choose__cnt__right__city').on('touchmove', function (e) {
        e.stopPropagation();
      });
    }

    function defaultCity(myCityVar) {
      var temp = $(' [data-cityname="' + myCityVar + '"]');
      temp.addClass('f-colorc61');
      initStore(temp.data('cityid'));
    }

    /*----单击事件初始化---*/
    function clickProvEventLoad(data) {
      //
      $('.popbox-choose__cnt__left__prov__itm').click(function () {
        $('.popbox-choose__cnt__right__city__itm').remove();
        $('.popbox-choose__cnt__left__prov__itm').removeClass('f-bgwith');
        $(this).addClass('f-bgwith');
        var id = $(this).data('proid');
        InitCity(data[id]);
        clickCityeventLoad();
      });
    }

    function clickCityeventLoad() {
      $('.popbox-choose__cnt__right__city__itm').click(function () {
        $('.popbox-choose__cnt__right__city__itm').removeClass('f-colorc61');
        $(this).addClass('f-colorc61');
        initStore($(this).data('cityid'));
        var str = $('.f-bgwith').text() + ' ' + $(this).text() + ' ';
        $('.search-select__type-sel').text(str);
        $('.popbox-choose').hide();
      });
    }



    /*----初始化专营店信息---*/
    function initStore(cityId) {
      if (typeof (cityId) == "undefined") {
        return;
      }
      var url = options.storeUrl;
      $('.panel-block').not(":eq(0)").remove();

      $.post(url, {
        pageNum: "0",
        cityId: cityId,
        carBrandCode: "",
        xCoordinate: lng,
        yCoordinate: lat
      }, function (data) {
        var data = data.send;
        //var data = options.data1.send;
        if (data.length > 0) {
          var html = '';
          $.each(data, function (index, itm) {

            var address = itm.store.address;
            if (address.indexOf('省')) {
              address = address.substring(address.indexOf('省') + 1, address.length);
            }
            if (address.indexOf('市')) {
              address = address.substring(address.indexOf("市") + 1, address.length);
            }

            html += ' <div class="panel-block">';
            html += ' <div class="store-info-left">';
            html += ' <div data-storeid="' + itm.store.storeId + '" class="store-info-left__shop-name">' + itm.store.storeName + '</div>';
            html += ' <div class="place-msg">';
            html += ' <i class="place-msg__icon"></i>';
            html += ' <span class="f-colorgra">' + address + '</span>';
            html += ' </div>';
            html += '<div data-xm="' + itm.store.xcoordinate + '" data-ym="' + itm.store.ycoordinate + '" class="panel-block__map">【查看地图】</div>';
            html += '</div>';
            html += ' <div class="store-info-right">';
            html += ' <div class="store-info-right__length"> ' + (itm.distance / 1000).toFixed(1) + 'km</div>';
            html += '<a onclick="_smq.push([\'custom\',\'m_dealer\',\'4s_5\']);" href="tel:' + itm.store.servicePhone + '"><i class="store-info-right__phone-icon"></i></a>';
            html += '</div></div>';
          });
          $('.store-sel').append(html);
          $('.store-sel').on('touchmove', function (e) {
            e.stopPropagation();
          });
          $('.store-info-right').on('click', 'a', function (e) {
            e.stopPropagation();
          });
          if (options.delStore.length > 0) {
            $.each(options.delStore, function (ind, item) {
              $(' [data-storeid="' + item + '"]').hide();
            })
          }

          InitMap();
          clickStore();
        } else {
          console.log('获取数据出现错误');
        }
      }, 'json');
    }

    function clickStore() {
      $('.panel-block').not(":eq(0)").click(function () {
        if (typeof (options.callback) == "function") {
          options.callback($(this));
          $('.store-sel-wrap').hide();
        }
      })
    }
    /*-----初始化地图事件----*/
    function InitMap() {
      $('.panel-block').on('click', '.panel-block__map', function (e) {
        e.stopPropagation(); //阻止事件冒泡
        var map = new cbbMap();
        initMapDom();
        map.drawMap('mapNav', {
          lng: lng,
          lat: lat
        }, {
            lng: $(this).data('xm'),
            lat: $(this).data('ym')
          })
        $('#mapNav_wrap').show();
      });
    }

    function initMapDom() {
      if ($('#mapNav_wrap').length > 0) {
        $('#mapNav_wrap').show();
      } else {
        let html = '<div id="mapNav_wrap" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1002;">\
    		         <a href="#" class="store-sel__btn-close--map store-sel__btn-close">X</a>\
    			     <div id="mapNav" class="amap-container" style="position: absolute;width: 100%;height:100%;" >\
    			     </div>\
    		      </div>';
        $('body').append(html);
        $('.store-sel__btn-close--map').click(function () {
          $(this).parent("#mapNav_wrap").hide()
        });
      }
    }

  }

})($);