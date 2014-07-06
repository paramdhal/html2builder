htmlparser = require 'htmlparser2'
extend = require 'extend-object'
require 'string.prototype.repeat'

class H2BConvert
	constructor: () ->
		@input = ''
		@handler = new htmlparser.DomHandler @parse
		@parser = new htmlparser.Parser @handler
		@output = ''
		@selfclosing = ["area","base", "br", "col", "embed", "hr" ,"img", "input" ,"keygen", "link","meta" ,"param", "source" ,"wbr"]
		@defaults = 
			format: false
		@options = {}

	setInput: (input)->
		@input = input
		@tabs = 0
		@output = ''
	getOutput: (options)->

		extend @options,@defaults,options

		@setWhiteSpace @options.format
		@parser.write(@input)
		@parser.done();
		@parser.reset();
		return @output

	parse: (error, dom)=>
		if error
			console.log error
		else
			#console.log dom
			@iterate dom
	
	iterate: (dom)->
		dom.forEach @iterator	

	iterator: (val)=>
		switch val.type
			when "tag" then @tag val
			when "text" then @text val
			when "comment" then @comment val
			
	tag: (item)->
		name = @capitalize item.name
		attribs = @attribs item.attribs 
		attribs =  attribs.join('')
		comma = if @selfclosing.indexOf(item.name) is -1 then ',' else ''
		tabs = @setTabs @tabs
		newline = if @options.format then "\n" else ""

		@output += "#{tabs}@w#{name}(#{attribs}#{comma}#{newline}"
		@increaseTab()
		@children item.children
		@output += "#{tabs})#{newline}"
		@decreaseTab()
		

	attribs: (attr)->
		for prop, value of attr
			val = @cleanText value
			"@wa(#{prop},#{val})"
	
	children: (children)->
		if children.length then @iterate children

	text: (item)->
		newline = if @options.format then "\n" else ""
		text = @cleanText item.data
		if @options.format and text is ' ' 
			text = ''
		else
			tabs = @setTabs @tabs
			text = tabs + text + newline
		@output += text

	comment: (item)->
		comment = @cleanText item.data
		@output += "@wcomment(#{comment})"

	cleanText: (string)->
		clean = string.replace /@/g,"{|@|}"
		clean.replace /,/g,"{,}"

	capitalize: (string)->
		string.charAt(0).toUpperCase() + string.slice(1);

	setWhiteSpace: (bool)->
		@handler._options.normalizeWhitespace = bool

	setTabs: (n)->
		'\t'.repeat n

	increaseTab: ->
		if @options.format then @tabs++

	decreaseTab: ->
		if @options.format then @tabs--

module.exports = H2BConvert




