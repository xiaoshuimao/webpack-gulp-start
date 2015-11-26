import {getQuery,cookie} from 'func';
let openId = getQuery('openid') || cookie.get('openId');
if(openId && openId !== 'null'){
	cookie.set('openId', openId, 30);
}
if(!openId){
	alert("不能获取微信授权信息，正在为您重新授权");
}
module.exports = openId;