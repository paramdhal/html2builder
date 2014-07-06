H2BConvert = require '../../app/js/src/h2bconvert'

describe 'convert', ->

	builder = new H2BConvert()

	it 'should take an input',->
		builder.setInput 'test'
		expect(builder.getOutput()).toBe 'test'
