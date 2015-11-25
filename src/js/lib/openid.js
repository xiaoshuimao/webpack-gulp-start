import {getQuery,cookie} from 'func';
let openId = cookie.get('openId') || getQuery('openid');
cookie.set('openId', openId, 30);
if(!openId){
	alert("不能获取微信授权信息，正在为您重新授权");
}
module.exports = openId;