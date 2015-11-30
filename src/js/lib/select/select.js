require('./select.less');
import $ from 'jq';
(function($) {
  $.fn.carSelect = function(options) {
    var el = $('body');
    var Default = {
      'url': '',
      'param': {},
      'title': [],
      'vel': 3,
      'html': '',
      'sign': '',
      'hasSearch': true,
      'data': {},
      'callback': function(eve) {}
    };
    options = $.extend(Default, options);

    function forEach(data, key, vel) {
      var html = '';
      var tag = '';
      $.each(data[key], function(index, itm) {
        html += '<li class="select-list_item" data-id=' + itm.id + '>' + itm.name + '</li>';
      });
      vel.append(html);

      $('body').on('touchmove', '.select-list', function(e) {
        e.stopPropagation();
      });
    }

    $(this).click(function() {

      $('body,html').addClass('z-noscroll');
      if ($('ul[data-type=' + options.sign + ']').length > 0) {
        $('ul[data-type=' + options.sign + ']').eq(0).show();
        return;
      }
      // console.log($.isEmptyObject(options.data)?1:2);
      if (options.url != '' && $.isEmptyObject(options.data)) {
        Initpage();
        $('ul[data-type=' + options.sign + ']').eq(0).append('<div class="select-list__loading"><i class="select-list__loading__icon"></i></div>').show();
        getData(options.url, options.param);
        return;
      }
      if (options.url == '') {
        Initpage();
        Init(options.data);
        $('ul[data-type=' + options.sign + ']').eq(0).show();
        return;
      }
    })

    function Initpage() {
      for (var i = 0; i < options.vel; i++) {
        // console.log(options.title[i]);
        options.html += '<ul data-type="' + options.sign + '" class="select-list select-list--vel' + i + '" style="display:none">';

        if (options.hasSearch) {
          options.html += '<li class="select-title "><a href="javascript:;" class="select-title__arrow"><i class="u__icon u__icon--right"></i></a>' + options.title[i] + '</li></ul>';
        } else {
          options.html += '<li class="select-title "><div class="select-title__arrow"></div> <input class="select-title__message" placeholder="' + options.title[i] + '"></li></ul>';
        }
      }
      el.append(options.html);
    }

    function Init(data) {
      forEach(data, options.sign, $('ul[data-type=' + options.sign + ']').eq(0));
      itmClick(data, $('ul[data-type=' + options.sign + ']').eq(0));

      $('.select-title__arrow').click(function() {
        $(this).parent().parent().hide();
        $('body,html').removeClass('z-noscroll');
      });
      $('.select-title__message').keyup(function() {
        var search = ':contains(' + $(this).val() + ')';
        $(this).parent().nextAll().hide().filter(search).show();

      })
    }

    function itmClick(data, tag) {
      tag.children('li:not(:first-child)').click(function() {
        var next = $(this).parent().next('ul[data-type=' + options.sign + ']');
        if (next.length > 0) {
          tag.find('.select-title__message').val('');
          tag.children('li').show();
          tag.nextAll().children('li:not(:first-child)').remove();
          next.show();
          var id = $(this).data('id');
          forEach(data, id, next);
          next.on('touchmove', function(e) {
            e.stopPropagation();
          });
          itmClick(data, next);


        } else {
          $('ul.select-list').hide();
          if (typeof(options.callback) == "function") {
            $('body,html').removeClass('z-noscroll');
            options.callback($(this));
          }
        }
      })
      return;
    }

    function getData(url, param) {
      var param = param ? param : "";
      $.ajax({
        url: url,
        data: param,
        dataType: 'json',
        timeout: 6000,
        send: function() {

        },
        success: function(data) {
          if (data.error == '0') {
            Init(data.data);
            $('.select-list__loading').detach();
            //$('.select-list--vel0').show();
          } else {
            console.log("Data error!!");
          }
        },
        error: function(x, y, z) {
          console.log(x + "///" + y + "??" + z);
          console.log("Http quire error!!");
        }

      })
    }

  }
})($);