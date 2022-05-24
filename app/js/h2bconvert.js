const {DomHandler,Parser} = require('htmlparser2');
const { isSVG }  = require('./svg.js');

const types = {
	builder: {
		macro: "@",
		braceleft: "{",
		braceright: "}"
	},
	advanced: {
		macro: "⌽",
		braceleft: "⎡",
		braceright: "⎤"
	}
}

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

class H2BConvert {

	constructor(type = "builder") {
		this.setType("builder");
		this.input = '';
		this.handler = new DomHandler(this.parse.bind(this));
		this.parser = new Parser(this.handler, {
			recognizeSelfClosing: true
		});
		this.output = '';
		this.selfclosing = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "wbr"];
	}
	setType(type = "builder") {
		this.type = types.hasOwnProperty(type) ? type : "builder";
	}
	setInput(input) {
		this.input = input;
		this.output = '';
	}
	getOutput() {
		this.parser.reset();
		this.parser.write(this.input);
		this.parser.done();
		return this.output;
	}
	parse(error, dom) {
		if (error) {
			this.output = error;
		} else {
			this.output = this.iterate(dom);
		}
	}
	iterate(dom) {
		return dom.reduce(this.iterator.bind(this), "");
	}
	iterator(prev, val) {
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
	tag(item) {
		let output = "";

        const {macroName,attributes} = this.getMacro(item);

		const attribs = this.attribs(attributes).join('');
		let comma = this.selfclosing.indexOf(item.name) === -1 ? ',' : '';
		let macroSymbol = this.getSymbol('macro');

		output += `${macroSymbol}${macroName}${attribs}${comma}`;
		output += this.children(item.children);
		return output += ")";
	}


	attribs(attr) {
		var results = [];
		let macro = this.getSymbol('macro');
		for (let prop in attr) {
			let val = this.cleanText(attr[prop]);
			results.push(`${macro}wa(${prop},${val})`);
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
		let macro = this.getSymbol('macro');
		return `${macro}wcomment(${str})`;
	}
	cleanText(string) {
		const braceLeft = this.getSymbol('braceleft');
		const braceRight = this.getSymbol('braceright');

        if(!string.includes(',')){
            return string;
        }

		return braceLeft + string + braceRight;
	}

	getSymbol(symbol) {
		return types[this.type][symbol];
	}
    getMacro(item) {


        return {macroName:this._getMacroName(item),attributes:item.attribs}
	}

    _getMacroName(item){

        const {name,attribs} = item;

        if(attribs.hasOwnProperty("xmlns") && attribs.xmlns === "http://www.w3.org/1999/xhtml"){

            delete attribs.xmlns;

            return `wDocument(${name},`;
        }else if(name.includes('-')){
            return `wtag(${name},`;
        }else{
            const prefix =  isSVG(name) ? "v" : "w";
            const capitalized = capitalize(name);
            return  `${prefix}${capitalized}(`;
        }
    }



}

module.exports = H2BConvert;