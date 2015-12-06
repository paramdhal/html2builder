'use strict';

import H2BConvert from './h2bconvert';
import H2BFormat from './h2bformat';
import $ from 'jQuery';


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
