import $ from 'jq';
require('./zc.less');
var form = require('./form.html');
import {getQuery} from 'func';
var layer = require('layer');


$(function(){

	layer.open({
    type: 1,
    content: form,
   });
})
