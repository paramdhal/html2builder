H2BConvert = require '../../app/js/src/h2bconvert'

describe 'convert', ->

	builder = new H2BConvert()

	it 'should take an input',->
		builder.setInput 'some input'
		expect(builder.input).toBe 'some input'

	it 'should return an ouput', ->
		builder.setInput 'some input'
		expect(builder.getOutput()).toBe 'some input'

	it 'should return macro code for html',->
		builder.setInput '<div></div><li></li>'
		expect(builder.getOutput()).toBe '@wDiv(,)@wLi(,)'

	it 'should return macro code for atrributes',->
		builder.setInput '<div class="test" id="test" data-test="test"></div>'
		expect(builder.getOutput()).toBe '@wDiv(@wa(class,test)@wa(id,test)@wa(data-test,test),)'

	it 'should return text inside and outside of tags',->
		builder.setInput 'Test<div>Test</div>Test'
		expect(builder.getOutput()).toBe 'Test@wDiv(,Test)Test'

	it 'should return comments as macros',->
		builder.setInput '<!--Comment here-->'
		expect(builder.getOutput()).toBe '@wcomment(Comment here)'

	it 'should protect commas inside of text and comments',->
		builder.setInput '<!--,here,and,here-->'
		expect(builder.getOutput()).toBe '@wcomment({,}here{,}and{,}here)'
		builder.setInput 'here,,here'
		expect(builder.getOutput()).toBe 'here{,}{,}here'

	it 'should protect @ inside of text and comments',->
		builder.setInput '<!--@here@-->'
		expect(builder.getOutput()).toBe '@wcomment({|@|}here{|@|})'
		builder.setInput '@here@'
		expect(builder.getOutput()).toBe '{|@|}here{|@|}'

	it 'should protect @ and commas inside attribute values',->
		builder.setInput '<div data-value="@test,ss,"></div>'
		expect(builder.getOutput()).toBe '@wDiv(@wa(data-value,{|@|}test{,}ss{,}),)'

	it 'should preserve whitespace',->
		builder.setInput '<div>\t\t</div>\n\n<div></div>\n'
		expect(builder.getOutput()).toBe '@wDiv(,\t\t)\n\n@wDiv(,)\n'

	it 'should deal with self closing tags',->
		builder.setInput '<meta content="test" />'
		expect(builder.getOutput()).toBe '@wMeta(@wa(content,test))'


