var H2BConvert, htmlparser,
	bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

htmlparser = require('htmlparser2');
require('string.prototype.repeat');

H2BConvert = (function() {
	function H2BConvert() {
		this.iterator = bind(this.iterator, this);
		this.parse = bind(this.parse, this);
		this.input = '';
		this.handler = new htmlparser.DomHandler(this.parse);
		this.parser = new htmlparser.Parser(this.handler, {
			recognizeSelfClosing: true
		});
		this.output = '';
		this.selfclosing = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "wbr"];
	}

	H2BConvert.prototype.setInput = function(input) {
		this.input = input;
		return this.output = '';
	};

	H2BConvert.prototype.getOutput = function() {
		this.parser.write(this.input);
		this.parser.done();
		this.parser.reset();
		return this.output;
	};

	H2BConvert.prototype.parse = function(error, dom) {
		if (error) {
			return console.log(error);
		} else {
			return this.iterate(dom);
		}
	};

	H2BConvert.prototype.iterate = function(dom) {
		return dom.forEach(this.iterator);
	};

	H2BConvert.prototype.iterator = function(val) {
		switch (val.type) {
			case "tag":
				return this.tag(val);
			case "script":
				return this.tag(val);
			case "text":
				return this.text(val);
			case "comment":
				return this.comment(val);
		}
	};

	H2BConvert.prototype.tag = function(item) {
		var attribs, comma, extra, name;
		name = this.capitalize(item.name);
		extra = '';
		attribs = item.attribs;
		if (attribs.hasOwnProperty("xmlns") && attribs.xmlns === "http://www.w3.org/1999/xhtml") {
			delete attribs.xmlns;
			name = "Document";
			extra = item.name + ",";
		}
		attribs = this.attribs(attribs);
		attribs = attribs.join('');
		comma = this.selfclosing.indexOf(item.name) === -1 ? ',' : '';
		this.output += "@w" + name + "(" + extra + attribs + comma;
		this.children(item.children);
		return this.output += ")";
	};

	H2BConvert.prototype.attribs = function(attr) {
		var prop, results, val, value;
		results = [];
		for (prop in attr) {
			value = attr[prop];
			val = this.cleanText(value);
			results.push("@wa(" + prop + "," + val + ")");
		}
		return results;
	};

	H2BConvert.prototype.children = function(children) {
		if (children.length) {
			return this.iterate(children);
		}
	};

	H2BConvert.prototype.text = function(item) {
		var text;
		text = this.cleanText(item.data);
		return this.output += text;
	};

	H2BConvert.prototype.comment = function(item) {
		var comment;
		comment = this.cleanText(item.data);
		return this.output += "@wcomment(" + comment + ")";
	};

	H2BConvert.prototype.cleanText = function(string) {
		var clean;
		clean = string.replace(/@/g, "{|@|}");
		return clean.replace(/,/g, "{,}");
	};

	H2BConvert.prototype.capitalize = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	return H2BConvert;

})();

module.exports = H2BConvert;