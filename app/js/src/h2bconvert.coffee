htmlparser = require 'htmlparser2'
require 'string.prototype.repeat'

class H2BConvert
	constructor: () ->
		@input = ''
		@handler = new htmlparser.DomHandler @parse 
		@parser = new htmlparser.Parser @handler,recognizeSelfClosing:true
		@output = ''
		@selfclosing = ["area","base", "br", "col", "embed", "hr" ,"img", "input" ,"keygen", "link","meta" ,"param", "source" ,"wbr"]

	setInput: (input)->
		@input = input
		@output = ''

	getOutput: ()->
		@parser.write(@input)
		@parser.done();
		@parser.reset();
		@output

	parse: (error, dom)=>
		if error
			console.log error
		else
			@iterate dom
	
	iterate: (dom)->
		dom.forEach @iterator	

	iterator: (val)=>
		switch val.type
			when "tag" then @tag val
			when "script" then @tag val
			when "text" then @text val
			when "comment" then @comment val
			
	tag: (item)->
		name = @capitalize item.name
		attribs = @attribs item.attribs 
		attribs =  attribs.join('')
		comma = if @selfclosing.indexOf(item.name) is -1 then ',' else ''
		
		@output += "@w#{name}(#{attribs}#{comma}"
		@children item.children
		@output += ")"
		
	attribs: (attr)->
		for prop, value of attr
			val = @cleanText value
			"@wa(#{prop},#{val})"
	
	children: (children)->
		if children.length then @iterate children

	text: (item)->
		text = @cleanText item.data
		@output += text

	comment: (item)->
		comment = @cleanText item.data
		@output += "@wcomment(#{comment})"

	cleanText: (string)->
		clean = string.replace /@/g,"{|@|}"
		clean.replace /,/g,"{,}"

	capitalize: (string)->
		string.charAt(0).toUpperCase() + string.slice(1);

	
module.exports = H2BConvert




