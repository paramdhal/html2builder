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
			this.output = error;
		} else {
			this.output = this.iterate(dom);
		}
	}
	iterate(dom){
		return dom.reduce(this.iterator.bind(this),"");
	}
	iterator(prev,val){
		switch (val.type) {
			case "tag":
				return prev + this.tag(val);
			case "script":
				return prev + this.tag(val);
			case "text":
				return prev + this.text(val);
			case "comment":
				return prev + this.comment(val);
			default:
				return prev;
		}
	}
	tag(item){

		let name = this.capitalize(item.name);
		let output = "";
		let extra = '';
		let attribs = item.attribs;
		if (attribs.hasOwnProperty("xmlns") && attribs.xmlns === "http://www.w3.org/1999/xhtml") {
			delete attribs.xmlns;
			name = "Document";
			extra = item.name + ",";
		}
		attribs = this.attribs(attribs);
		attribs = attribs.join('');
		let comma = this.selfclosing.indexOf(item.name) === -1 ? ',' : '';
		output += `@w${name}(${extra}${attribs}${comma}`;
		output += this.children(item.children);
		return output += ")";
	}
	attribs(attr) {
		var results = [];
		for (let prop in attr) {
			let val = this.cleanText(attr[prop]);
			results.push(`@wa(${prop},${val})`);
		}
		return results;
	}
	children(children) {
		return children.length ? this.iterate(children) : "";
	}
	text(item) {
		return this.cleanText(item.data);
	}
	comment(item) {
		let str = this.cleanText(item.data);
		return `@wcomment(${str})`;
	}
	cleanText(string) {
		let clean = string.replace(/@/g, "{|@|}");
		return clean.replace(/,/g, "{,}");
	}
	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}


module.exports = H2BConvert;