htmlparser = require 'htmlparser2'

class Html2Builder
	constructor: () ->
		@input = ''
		@handler = new htmlparser.DomHandler @parse
		@parser = new htmlparser.Parser @handler
		@output = ''
		@selfclosing = ["area","base", "br", "col", "embed", "hr" ,"img", "input" ,"keygen", "link","meta" ,"param", "source" ,"wbr"]

	setInput: (input)->
		@input = input
		@output = ''
	getOutput: ->
		@parser.write(@input)
		@parser.done();
		@parser.reset();
		return @output

	parse: (error, dom)=>
		if error
			console.log error
		else
			console.log dom
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
		
		console.log @selfclosing.indexOf item.name
		console.log comma
		@output += "@w#{name}(#{attribs}#{comma}"
		@children item.children
		@output += ')'

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
		clean = string.replace "@","{|@|}"
		clean.replace ",","{,}"

	capitalize: (string)->
		string.charAt(0).toUpperCase() + string.slice(1);

module.exports = Html2Builder
