Html2Builder = require '../../app/js/src/html2builder'

describe 'convert', ->

	builder = new Html2Builder()

	it 'should take an input',->
		builder.setInput 'test'
		expect(builder.input).toBe 'test'
