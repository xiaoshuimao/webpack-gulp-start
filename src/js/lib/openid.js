import {getQuery} from 'func';
let openId = getQuery('openId');
if(!openId){
	alert("不能获取微信授权信息，正在为您重新授权");
}
module.exports = openId;