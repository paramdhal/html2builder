import htmlparser from 'htmlparser2';
import 'string.prototype.repeat';

class H2BConvert{
	constructor(){
		this.input = '';
		this.handler = new htmlparser.DomHandler(this.parse.bind(this));
		this.parser = new htmlparser.Parser(this.handler, {
			recognizeSelfClosing: true
		});
		this.output = '';
		this.selfclosing = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "wbr"];
	}
	setInput(input){
		this.input = input;
		this.output = '';
	}
	getOutput(){
		this.parser.reset();
		this.parser.write(this.input);
		this.parser.done();
		return this.output;
	}
	parse(error,dom){
		if (error) {
			return console.log(error);
		} else {
			return this.iterate(dom);
		}
	}
	iterate(dom){
		return dom.forEach(this.iterator.bind(this));
	}
	iterator(val){
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
	}
	tag(item){

		var name = H2BConvert.capitalize(item.name);
		var extra = '';
		var attribs = item.attribs;
		if (attribs.hasOwnProperty("xmlns") && attribs.xmlns === "http://www.w3.org/1999/xhtml") {
			delete attribs.xmlns;
			name = "Document";
			extra = item.name + ",";
		}
		attribs = this.attribs(attribs);
		attribs = attribs.join('');
		let comma = this.selfclosing.indexOf(item.name) === -1 ? ',' : '';
		this.output += `@w${name}(${extra}${attribs}${comma}`;
		this.children(item.children);
		return this.output += ")";
	}
	attribs(attr) {
		
		var results = [];
		for (let prop in attr) {
			let value = attr[prop];
			let val = this.cleanText(value);
			results.push(`@wa(${prop},${val})`);
		}
		return results;
	}
	children(children) {
		if (children.length) {
			return this.iterate(children);
		}
	}
	text(item) {
		let str = this.cleanText(item.data);
		return this.output += str;
	}
	comment(item) {
		let str = this.cleanText(item.data);
		return this.output += `@wcomment(${str})`;
	}
	cleanText(string) {
		let clean = string.replace(/@/g, "{|@|}");
		return clean.replace(/,/g, "{,}");
	}
	static capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}


module.exports = H2BConvert;