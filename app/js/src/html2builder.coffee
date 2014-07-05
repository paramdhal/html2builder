htmlparser = require 'htmlparser2'

class Html2Builder
	constructor: (@input) ->
		@handler = new htmlparser.DomHandler @parse
		@parser = new htmlparser.Parser @handler
		@output = ''
	getOutput: ->

		@parser.write(@input)
		
		@parser.done();

		return @output

	parse: (error, dom)=>
		if error
			console.log error
		else
			console.log dom
			dom.forEach @iterate
			

	iterate: (val)=>
		switch val.type
			when "tag" then @tag val
			
	tag: (item)->
		name = @capitalize item.name
		attribs = @attribs item.attribs 
		attribs =  attribs.join('')
		@output += "@w#{name}(#{attribs},)\n"

	attribs: (attr)->
		for prop, value of attr
			"@wa(#{prop},#{value})"

	capitalize: (string)->
		string.charAt(0).toUpperCase() + string.slice(1);

module.exports = Html2Builder

# var htmlparser = require("htmlparser2");
# var rawHtml = "<div class='test'></div><div class='test'></div>";
# var handler = new htmlparser.DomHandler(function (error, dom) {
#     if (error)
#         console.log(error);
#     else
#         console.log(dom);
#     	dom.forEach(function(item){
#     		console.log(item);
#     	});

# });
# var parser = new htmlparser.Parser(handler);
# parser.write(rawHtml);
# parser.done();