var ContentPath = CONFIG.CONTEXT_PATH;
var Api = {
  clue: ContentPath + '/ajax/leaveInfo/cbbLeaveInfo.do',
  zc: ContentPath + "/oneyuan.htm?action=loadActivityInfo",
  r30: ContentPath + "/oneyuan.htm?action=loadR30ActivityInfo",
  submitPay: ContentPath + "/oneyuan.htm?action=saveOrder",
  r30Pay: ContentPath + "/oneyuan.htm?action=saveR30Order",
  vcode: ContentPath + "/oneyuan.htm?action=getVcode",
  vfan: ContentPath + "/oneyuan.htm?action=getOrderFans",
  r30fan: ContentPath + "/oneyuan.htm?action=getOrderR30Fans",
  urlCity: ContentPath + "/oneyuan.htm?action=loadAllCity",
  urlStore: ContentPath + '/web/activity/activitySearch.do?actionType=wapdealerbycity',
  carType: ContentPath + '/oneyuan.htm?action=loadAllCarType'
}

module.exports = Api;
