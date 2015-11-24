var ContentPath = "http://e4s.stg.dongfeng-nissan.com.cn/wap";
var Api = {
  zc_pay: ContentPath + '/oneyuan.htm?action=saveAwardOrder',
  zc_count: ContentPath + '/oneyuan.htm?action=countAwardOrder',
  clue: ContentPath + '/ajax/leaveInfo/cbbLeaveInfo.do',
  zc: ContentPath + "/oneyuan.htm?action=loadActivityInfo",
  r30: ContentPath + "/oneyuan.htm?action=loadR30ActivityInfo",
  submitPay: ContentPath + "/oneyuan.htm?action=saveOrder",
  r30Pay: ContentPath + "/oneyuan.htm?action=saveR30Order",
  vcode: ContentPath + "/oneyuan.htm?action=getVcode",
  vfan: ContentPath + "/oneyuan.htm?action=getOrderFans",
  r30fan: ContentPath + "/oneyuan.htm?action=getOrderR30Fans",
  city_api: ContentPath + "/oneyuan.htm?action=loadAllCity",
  store_api: 'http://e4s.stg.dongfeng-nissan.com.cn/web/activity/activitySearch.do?actionType=wapdealerbycity',
  carType: ContentPath + '/oneyuan.htm?action=loadAllCarType'
}

module.exports = Api;
