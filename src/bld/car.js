
  let car = {
    //返回为下拉表的数据
    "getModel": function(options) {
      var results;
      if (options == '全系车型') {
        results = this.getSelect(1);
      } else if (options == '全系车型（新蓝鸟、逍客除外）') {
        results = this.getSelect(2);
      } else {
        var arr = options.split("、");
        var option = "";
        var op = '<option value="tz-model" selected="selected" >请选择意向车型</option>';
        for (var i = 0; i < arr.length; i++) {
          option += "<option value='" + this.getSeriesID(arr[i]) + "'>" + arr[i] + "</option>";
        }
        results = op + option;
      }
      return results;
    },
    "getSeriesID": function(name) {
      var seriedid;
      switch (name) {
        case '轩逸·经典':
          seriedid = 10060;
          break;
        case '逍客':
          seriedid = 10140;
          break;
        case '全新逍客':
          seriedid = 101401;
          break;
        case '新势代奇骏':
          seriedid = 10220;
          break;
        case '玛驰':
          seriedid = 14660;
          break;
        case '阳光':
          seriedid = 24526;
          break;
        case '骐达':
          seriedid = 30606;
          break;
        case '全新楼兰':
          seriedid = 353861;
          break;
        case 'GT-R':
          seriedid = 43011;
          break;
        case '贵士':
          seriedid = 43012;
          break;
        case '启辰R50X':
          seriedid = 43013;
          break;
        case '启辰R50':
          seriedid = 430131;
          break;
        case '启辰D50':
          seriedid = 430132;
          break;
        case '轩逸':
          seriedid = 47710;
          break;
        case '骊威':
          seriedid = 49190;
          break;
        case '天籁':
          seriedid = 49291;
          break;
        case '天籁公爵':
          seriedid = 492911;
          break;
        case '370Z':
          seriedid = 49293;
          break;
        case '启辰晨风':
          seriedid = 49295;
          break;
        case '途乐':
          seriedid = 49297;
          break;
        case '启辰R30':
          seriedid = 49299;
          break;
        case '启辰T70':
          seriedid = 49300;
          break;
        case '启辰T70X':
          seriedid = 49301;
          break;
        case '蓝鸟':
          seriedid = 50001;
          break;
        default:
          break;
      }
      return seriedid;
    },
    "getSelect": function(res) {
      var rop = "<option value='tg_m' selected='selected' >请选择意向车型</option><option value='10060' >轩逸·经典</option><option value='101401' >全新逍客</option><option value='10220' >新势代奇骏</option><option value='14660' >玛驰</option><option value='24526' >阳光</option><option value='30606' >骐达</option><option value='353861' >全新楼兰</option> <option value='43011' >GT-R</option><option value='43012' >贵士</option><option value='43013' >启辰R50X</option><option value='430131' >启辰R50</option><option value='430132' >启辰D50</option><option value='47710' >轩逸</option><option value='49190' >骊威</option><option value='49291' >新天籁</option><option value='492911' >新天籁·公爵</option><option value='49293' >370Z</option><option value='49295' >启辰晨风</option><option value='49297' >途乐</option><option value='49299' >启辰R30</option><option value='49300' >启辰T70</option><option value='49301' >启辰T70X</option>";
      if (res == 1) {
        rop += "<option value='50001'>蓝鸟</option><option value='10140'>逍客</option>";
      }
      return rop;
    },
    //传入城市ID返回经销商数据
    "getDealer": function(cid) {
      const DealerList = {
        'TG': [{
          'id': 'S2015012313547',
          'cityid': '20302',
          'name': '东莞东风南方莞太',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072201071',
          'cityid': '20358',
          'name': '厦门瑞荣嘉诚海沧',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072201416',
          'cityid': '20266',
          'name': '南通太平洋',
          'carmodel': '轩逸·经典、阳光、骐达'
        }, {
          'id': 'S2015072210439',
          'cityid': '20260',
          'name': '常州中天',
          'carmodel': '轩逸、天籁、逍客'
        }, {
          'id': 'S2015072210311',
          'cityid': '20278',
          'name': '杭州和诚城北',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210453',
          'cityid': '20283',
          'name': '宁波元通友和',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210279',
          'cityid': '20267',
          'name': '苏州伟海',
          'carmodel': '轩逸·经典、轩逸、新势代奇骏、逍客'
        }, {
          'id': 'S2015072210507',
          'cityid': '20237',
          'name': '威海世通',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210632',
          'cityid': '20289',
          'name': '温州龙锦',
          'carmodel': '轩逸、新势代奇骏、天籁'
        }, {
          'id': 'S2015072210489',
          'cityid': '20309',
          'name': '江门江沙',
          'carmodel': '轩逸、天籁、骐达'
        }, {
          'id': 'S2015072210476',
          'cityid': '20344',
          'name': '南昌汇恒',
          'carmodel': '天籁、轩逸、轩逸·经典、新势代奇骏、阳光、骐达'
        }, {
          'id': 'S2015072210310',
          'cityid': '20304',
          'name': '南海雄峰',
          'carmodel': '新势代奇骏、天籁、轩逸、轩逸·经典、骐达、阳光、骊威、全新楼兰'
        }, {
          'id': 'S2015072210392',
          'cityid': '20335',
          'name': '南宁广缘',
          'carmodel': '天籁、新势代奇骏、轩逸、轩逸·经典、阳光'
        }, {
          'id': 'S2015072210321',
          'cityid': '20181',
          'name': '长沙星沙',
          'carmodel': '轩逸、轩逸·经典、新势代奇骏'
        }, {
          'id': 'S2015072201462',
          'cityid': '20222',
          'name': '启辰郑州威佳圃田',
          'carmodel': '启辰T70、启辰T70X、启辰R50、启辰D50、启辰R30'
        }, {
          'id': 'S2015072210250',
          'cityid': '20001',
          'name': '北京中汽雷日',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210550',
          'cityid': '20391',
          'name': '大连中升搏通',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210273',
          'cityid': '20080',
          'name': '太原大源',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210340',
          'cityid': '20003',
          'name': '天津滨海',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210773',
          'cityid': '20083',
          'name': '运城瑞盈',
          'carmodel': '全系车型'
        }, {
          'id': 'S2015072210304',
          'cityid': '20265',
          'name': '南京汉虹',
          'carmodel': '全系车型'
        }]
      };
      var arr;
      var dataT = DealerList.TG;
      for (var i = 0; i < dataT.length; i++) {
        if (cid == dataT[i].cityid) {
          arr = dataT[i];
        }
      };
      return arr;
    }

  };
  module.exports = car;
