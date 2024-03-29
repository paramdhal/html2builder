const H2BConvert  = require('./h2bconvert');
const H2BFormat = require('./h2bformat');
const $ = require('jQuery');


const $input = $('#input');
const $output = $('#output');
const $convert = $('#convert');
const $format = $('#format');
const h2bconvert = new H2BConvert();
const h2bformat= new H2BFormat();

$convert.on('click',convertHTML);
$format.on('click',formatHTML);
$input.val(document.documentElement.outerHTML);

formatHTML();

function convertHTML(){
	convert(h2bconvert);
}

function formatHTML(){
	convert(h2bformat);
}

function convert(instance){
	instance.setType($('[name="type"]:checked').val());
	instance.setInput($input.val());
	$output.val(instance.getOutput());
}
