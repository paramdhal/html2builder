'use strict';

// var $ = require('jquery');
var Html2Builder = require('./html2builder');


var input = document.getElementById('input');
var output = document.getElementById('output');
var convert = document.getElementById('convert');

var builder = new Html2Builder();
convert.addEventListener('click',convertHTML);
convertHTML();

function convertHTML(){
	builder.setInput(input.value);
	output.value = builder.getOutput();
}

// var htmlparser = require("htmlparser2");
// var rawHtml = "<div class='test'></div><div class='test'></div>";
// var handler = new htmlparser.DomHandler(parse);
// function parse(){
// 	console.log("Parse");
// }

// var parser = new htmlparser.Parser(handler);
// parser.write(rawHtml);
// parser.done();