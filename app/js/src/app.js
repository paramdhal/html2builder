'use strict';

// var $ = require('jquery');
var H2BConvert= require('./h2bconvert');


var input = document.getElementById('input');
var output = document.getElementById('output');
var convert = document.getElementById('convert');
var format = document.getElementById('format');

var builder = new H2BConvert();
convert.addEventListener('click',convertHTML);
format.addEventListener('click',formatHTML);
formatHTML();

function convertHTML(){
	builder.setInput(input.value);
	output.value = builder.getOutput();
}

function formatHTML(){
	builder.setInput(input.value);
	output.value = builder.getOutput({
		format: true
	});
}
