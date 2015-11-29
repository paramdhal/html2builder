'use strict';

var H2BConvert= require('./h2bconvert');
var H2BFormat= require('./h2bformat');

var input = document.getElementById('input');
var output = document.getElementById('output');
var convert = document.getElementById('convert');
var format = document.getElementById('format');

var h2bconvert = new H2BConvert();
var h2bformat= new H2BFormat();
convert.addEventListener('click',convertHTML);
format.addEventListener('click',formatHTML);
input.value = document.documentElement.outerHTML;
formatHTML();

function convertHTML(){
	h2bconvert.setInput(input.value);
	output.value = h2bconvert.getOutput();
}

function formatHTML(){
	h2bformat.setInput(input.value);
	output.value = h2bformat.getOutput();
}
