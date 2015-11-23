var cbbMap = function() {
  this.getAddressByPos = function(pos, callback) {
    var geoc = new BMap.Geocoder();
    geoc.getLocation(pos, function(rs) {
      var addComp = rs.addressComponents;
      var province = addComp.province; //省
      province = province.substr(0, province.length - 1);
      var city = addComp.city; //市
      city = city.substr(0, city.length - 1);
      var district = addComp.district; //区
      var street = addComp.street; //街道
      var streetNumber = addComp.streetNumber; //门牌号
      return callback({
        'address': province + '省' + city + '市' + district + street + streetNumber,
        'province': province,
        'city': city
      });
    });
  }
  this.getCurPos = function(callback) {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        callback(r.point);
        console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
        console.log(r.point);
      } else {
        alert('failed' + this.getStatus());
      }
    }, {
      enableHighAccuracy: true
    });
  }
  this.drawMap = function(dom, start, end) {
    var center = {
      lng: (start.lng + start.lat) / 2,
      lat: (end.lng + end.lat) / 2
    }
    console.log('地图中心为:', center);
    var map = new BMap.Map(dom);
    map.centerAndZoom(new BMap.Point(center.lng, center.lat), 12);
    console.log('地图创建到指定dom成功:' + map)
    var start = new BMap.Point(start.lng, start.lat);
    var end = new BMap.Point(end.lng, end.lat);
    console.log('初始化起点终点成功:', start, end);
    var driving = new BMap.DrivingRoute(map, {
      renderOptions: {
        map: map,
        autoViewport: true
      }
    });
    driving.search(start, end);
    console.log('绘制路线完成！');
  }
  return this;
}

module.exports = cbbMap;
