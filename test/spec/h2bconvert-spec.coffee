H2BConvert = require '../../app/js/src/h2bconvert'
H2BFormat = require '../../app/js/src/h2bformat'

baseExpectations = (instance)->
	it 'should take an input',->
		instance.setInput 'some input'
		expect(instance.input).toBe 'some input'
	it 'should return an ouput', ->
		instance.setInput 'some input'
		expect(instance.getOutput()).toBe 'some input'

	it 'should return macro code for html',->
		instance.setInput '<div></div>'
		expect(instance.getOutput()).toBe '@wDiv(,)'

	it 'should return macro code for atrributes',->
		instance.setInput '<div class="test" id="test" data-test="test"></div>'
		expect(instance.getOutput()).toBe '@wDiv(@wa(class,test)@wa(id,test)@wa(data-test,test),)'

	it 'should return comments as macros',->
		instance.setInput '<!--Comment here-->'
		expect(instance.getOutput()).toBe '@wcomment(Comment here)'

	it 'should protect commas inside of text and comments',->
		instance.setInput '<!--,here,and,here-->'
		expect(instance.getOutput()).toBe '@wcomment({,}here{,}and{,}here)'
		instance.setInput 'here,,here'
		expect(instance.getOutput()).toBe 'here{,}{,}here'

	it 'should protect @ inside of text and comments',->
		instance.setInput '<!--@here@-->'
		expect(instance.getOutput()).toBe '@wcomment({|@|}here{|@|})'
		instance.setInput '@here@'
		expect(instance.getOutput()).toBe '{|@|}here{|@|}'

	it 'should protect @ and commas inside attribute values',->
		instance.setInput '<div data-value="@test,ss,"></div>'
		expect(instance.getOutput()).toBe '@wDiv(@wa(data-value,{|@|}test{,}ss{,}),)'

	it 'should deal with self closing tags',->
		instance.setInput '<meta content="test" />'
		expect(instance.getOutput()).toBe '@wMeta(@wa(content,test))'


describe 'convert', ->

	convert = new H2BConvert()

	baseExpectations convert

	it 'should return text inside and outside of tags',->
		convert.setInput 'Test<div>Test</div>Test'
		expect(convert.getOutput()).toBe 'Test@wDiv(,Test)Test'
	
	it 'should preserve whitespace',->
		convert.setInput '<div>\t\t</div>\n\n<div></div>\n'
		expect(convert.getOutput()).toBe '@wDiv(,\t\t)\n\n@wDiv(,)\n'

describe 'format', ->

	format = new H2BFormat()

	baseExpectations format

	it 'should return text inside and outside of tags',->
		format.setInput 'Test<div>Test</div>Test'
		expect(format.getOutput()).toBe 'Test\n@wDiv(,Test)\nTest'

	it 'should remove unnecessary whitespace', ->
		format.setInput 'Test<div>Test\n</div>\n\nTest'
		expect(format.getOutput()).toBe 'Test\n@wDiv(,Test)\nTest'

		format.setInput 'Test <span>text</span> text'
		expect(format.getOutput()).toBe 'Test \n@wSpan(,text)\n text'

	it 'should remove unnecessary tabs', ->
		format.setInput 'Test\tTest'
		expect(format.getOutput()).toBe 'TestTest'

	it 'should format text only inside html element to be one line', ->
		format.setInput '<div>test</div>'
		expect(format.getOutput()).toBe '@wDiv(,test)'
	
	it 'should format more than text inside html element to be mulitline', ->
		format.setInput '<div>test<span></span>test</div>'
		expect(format.getOutput()).toBe '@wDiv(,\n\ttest\n\t@wSpan(,)\n\ttest\n)'

