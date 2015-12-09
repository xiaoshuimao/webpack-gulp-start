let e4s = CONFIG.API.E4S;
let Api = {
  /*-----公共接口----*/
  vcode_api: e4s + "/oneyuan.htm?action=getVcode",//验证码
  clue_api: e4s + '/ajax/leaveInfo/cbbLeaveInfo.do',//留资
  city_api: e4s + "/oneyuan.htm?action=loadAllCity",//城市
  store_api: e4s + '/web/activity/activitySearch.do?actionType=wapdealerbycity',//专营店
  carType_api: e4s + '/oneyuan.htm?action=loadAllCarType',//车型车系
  wxpay_api: CONFIG.API.E4Swap + '/themes/chebaba/WCPay/jsapi2.jsp',//微信支付
  /*-----公共接口----*/
    
  /*----一元夺券-----*/
  zc_pay: e4s + '/oneyuan.htm?action=saveAwardOrder',// 支付
  zc_count: e4s + '/oneyuan.htm?action=countAwardOrder',//活动数据
  zc_pay12: e4s + '/oneyuan.htm?action=saveAwardOrderDoubleTwo',// 双十二支付
  zc_count12: e4s + '/oneyuan.htm?action=countAwardOrderDoubleTwo',//双十二活动数据
  /*----一元夺券-----*/
  
  /*-----蓝鸟众筹 r30众筹 接口----*/
  zc: e4s + "/oneyuan.htm?action=loadActivityInfo",
  r30: e4s + "/oneyuan.htm?action=loadR30ActivityInfo",
  submitPay: e4s + "/oneyuan.htm?action=saveOrder",
  r30Pay: e4s + "/oneyuan.htm?action=saveR30Order",
  vfan: e4s + "/oneyuan.htm?action=getOrderFans",
  r30fan: e4s + "/oneyuan.htm?action=getOrderR30Fans",
  /*-----蓝鸟众筹 r30众筹 接口----*/
  
  /*--------新车鉴赏-----*/
  joincount_xk:e4s + "/ajax/leaveInfo/cbbLeaveInfo.do?actionType=accessleaveinfocount&carSeriesId=101401&activityId=shuang12huodong",
  joincount_lan:e4s + "/ajax/leaveInfo/cbbLeaveInfo.do?actionType=accessleaveinfocount&carSeriesId=50001&activityId=shuang12huodong",
  joincount_lou:e4s + "/ajax/leaveInfo/cbbLeaveInfo.do?actionType=accessleaveinfocount&carSeriesId=353861&activityId=shuang12huodong",
  awardlist:e4s + "/ajax/leaveInfo/cbbLeaveInfo.do?actionType=accessleaveinfolist&activityId=shuang12huodong",

  /*----堡垒店接口 ------*/
  bl_picCity:"http://172.26.153.45:8080/cbbweb/Speccar.do?action=findCitiesBySeriesId",
  bl_store:"http://172.26.153.45:8080/cbbweb/Speccar.do?action=findBySeriesId",
  bl_gifType:"http://172.26.153.45:8080/cbbweb/Speccar.do?action=findByDealerId"

}

module.exports = Api;
