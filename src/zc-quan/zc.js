require('./zc.less');
import $ from 'jq';
import {getQuery} from 'func';
let layer = require('layer');


$(function(){

	layer.open({
    type: 1,
    content: require('form'),
		style:"width:90%"
   });
})
