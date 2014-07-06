H2BConvert= require('./h2bconvert');
htmlparser = require 'htmlparser2'

class H2BFormat extends H2BConvert
	constructor: () ->
		super
		@handler = new htmlparser.DomHandler @parse, normalizeWhitespace: true
		@parser = new htmlparser.Parser @handler

	setInput: (input)->
		super
		@tabs = 0

	tag: (item)->
		name = @capitalize item.name
		attribs = @attribs item.attribs 
		attribs =  attribs.join('')
		comma = if @selfclosing.indexOf(item.name) is -1 then ',' else ''
		tabs = @setTabs @tabs
		

		@output += "#{tabs}@w#{name}(#{attribs}\n"
		@increaseTab()
		@children item.children
		@output += "#{tabs})\n"
		@decreaseTab()

	text: (item)->
		text = @cleanText item.data
		if text is ' ' 
			text = ''
		else
			tabs = @setTabs @tabs
			text = tabs + text + "\n"
		@output += text

	increaseTab: ->
		@tabs++

	decreaseTab: ->
		@tabs--

	setTabs: (n)->
		'\t'.repeat n

module.exports = H2BFormat
	
