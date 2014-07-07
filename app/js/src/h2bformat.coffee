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

	getOutput: ()->
		super
		return @output.trim()


	tag: (item)->
		name = @capitalize item.name
		attribs = @attribs item.attribs 
		attribs =  attribs.join('')
		comma = if @selfclosing.indexOf(item.name) is -1 then ',' else ''
		tabs = @setTabs @tabs
		children  = @checkForTag item.children
		if children then newline = '\n' else newline = ''

		@increaseTab() if children
		@output += "#{tabs}@w#{name}(#{attribs}#{comma}#{newline}"
		
		@children item.children

		tabs = "" if not children	
		@output += "#{tabs})\n"
		@decreaseTab() if children

	text: (item)->
		text = @cleanText item.data
		tabs = ''
		if text is ' ' 
			text = ''
		else
			if item.parent and @checkForTag item.parent.children then tabs = @setTabs @tabs
			text = tabs + text
			if item.next isnt null then text =  text + '\n' 
			
		@output += text

	comment: (item)->
		comment = @cleanText item.data
		tabs = @setTabs @tabs
		@output += "#{tabs}@wcomment(#{comment})"
		@output += "\n"

	increaseTab: ->
		@tabs++

	decreaseTab: ->
		@tabs--

	setTabs: (n)->
		'\t'.repeat n

	checkForTag: (children)->
		children.some (el)->
			el.type is 'tag' or el.type is 'comment'

module.exports = H2BFormat
	
