var H2BConvert = require('../../app/js/src/h2bconvert');
var H2BFormat = require('../../app/js/src/h2bformat');

var baseExpectations = function(instance) {
	it('should take an input', function() {
		instance.setInput('some input');
		return expect(instance.input).toBe('some input');
	});
	it('should return an ouput', function() {
		instance.setInput('some input');
		return expect(instance.getOutput()).toBe('some input');
	});
	it('should return macro code for html', function() {
		instance.setInput('<div></div>');
		return expect(instance.getOutput()).toBe('@wDiv(,)');
	});
	it('should return macro code for atrributes', function() {
		instance.setInput('<div class="test" id="test" data-test="test"></div>');
		return expect(instance.getOutput()).toBe('@wDiv(@wa(class,test)@wa(id,test)@wa(data-test,test),)');
	});
	it('should return comments as macros', function() {
		instance.setInput('<!--Comment here-->');
		return expect(instance.getOutput()).toBe('@wcomment(Comment here)');
	});
	it('should protect commas inside of text and comments', function() {
		instance.setInput('<!--,here,and,here-->');
		expect(instance.getOutput()).toBe('@wcomment({,}here{,}and{,}here)');
		instance.setInput('here,,here');
		return expect(instance.getOutput()).toBe('here{,}{,}here');
	});
	it('should protect @ inside of text and comments', function() {
		instance.setInput('<!--@here@-->');
		expect(instance.getOutput()).toBe('@wcomment({|@|}here{|@|})');
		instance.setInput('@here@');
		return expect(instance.getOutput()).toBe('{|@|}here{|@|}');
	});
	it('should protect @ and commas inside attribute values', function() {
		instance.setInput('<div data-value="@test,ss,"></div>');
		return expect(instance.getOutput()).toBe('@wDiv(@wa(data-value,{|@|}test{,}ss{,}),)');
	});
	it('should deal with self closing tags', function() {
		instance.setInput('<meta content="test" />');
		return expect(instance.getOutput()).toBe('@wMeta(@wa(content,test))');
	});
	return it('should deal with document with xmlns', function() {
		instance.setInput('<!DOCTYPE div><div xmlns="http://www.w3.org/1999/xhtml"></div>');
		return expect(instance.getOutput()).toBe('@wDocument(div,,)');
	});
};

describe('convert', function() {
	var convert;
	convert = new H2BConvert();
	baseExpectations(convert);
	it('should return text inside and outside of tags', function() {
		convert.setInput('Test<div>Test</div>Test');
		return expect(convert.getOutput()).toBe('Test@wDiv(,Test)Test');
	});
	return it('should preserve whitespace', function() {
		convert.setInput('<div>\t\t</div>\n\n<div></div>\n');
		return expect(convert.getOutput()).toBe('@wDiv(,\t\t)\n\n@wDiv(,)\n');
	});
});

describe('format', function() {
	var format;
	format = new H2BFormat();
	baseExpectations(format);
	it('should return text inside and outside of tags', function() {
		format.setInput('Test<div>Test</div>Test');
		return expect(format.getOutput()).toBe('Test\n@wDiv(,Test)\nTest');
	});
	it('should remove unnecessary whitespace', function() {
		format.setInput('Test<div>Test\n</div>\n\nTest');
		expect(format.getOutput()).toBe('Test\n@wDiv(,Test)\nTest');
		format.setInput('Test <span>text</span> text');
		return expect(format.getOutput()).toBe('Test \n@wSpan(,text)\n text');
	});
	it('should remove unnecessary tabs', function() {
		format.setInput('Test\tTest');
		return expect(format.getOutput()).toBe('TestTest');
	});
	it('should format text only inside html element to be one line', function() {
		format.setInput('<div>test</div>');
		return expect(format.getOutput()).toBe('@wDiv(,test)');
	});
	it('should format more than text inside html element to be mulitline', function() {
		format.setInput('<div>test<span></span>test</div>');
		return expect(format.getOutput()).toBe('@wDiv(,\n\ttest\n\t@wSpan(,)\n\ttest\n)');
	});
	return it('should deal with self closing tags which are not self closing', function() {
		format.setInput('<div><span/><div></div></div>');
		return expect(format.getOutput()).toBe('@wDiv(,\n\t@wSpan(,)\n\t@wDiv(,)\n)');
	});
});