const H2BConvert = require('./h2bconvert.js');

class H2BFormat extends H2BConvert {
	getOutput() {
		super.getOutput();
		return this.output.trim();
	}
	setInput(input) {
		this.tabs = 0;
		super.setInput(input);
	}

	tag(item) {
		let output = "";
        const {macroName,attributes} = this.getMacro(item);
		const attribs = this.attribs(attributes).join('');

		let comma = this.selfclosing.indexOf(item.name) === -1 ? ',' : '';
		let tabs = this.getTabs();
		let children = this.checkForTag(item.children);
		let newline = children ? '\n' : '';

		if (children) { this.increaseTab(); }
		let macro = this.getSymbol('macro');
		output += `${tabs}${macro}${macroName}${attribs}${comma}${newline}`;
		output += this.children(item.children);
		if (!children) { tabs = ""; }
		output += `${tabs})\n`;
		children && this.decreaseTab();
		return output;
	}

	text(item) {
		var text = this.cleanText(item.data);
		let tabs = '';
		if (text.trim() === '') {
			text = '';
		} else {
			if (item.parent && this.checkForTag(item.parent.children)) {
				tabs = this.getTabs();
			}
			text = tabs + text;
			if (item.next !== null || item.prev !== null) {
				text = `${text}\n`;
			}
		}
		return text;
	}

	comment(item) {
		var comment = this.cleanText(item.data);
		let tabs = this.getTabs();
		let macro = this.getSymbol('macro');
		return `${tabs}${macro}wcomment(${comment})\n`;
	}

	getTabs() {
		return '\t'.repeat(this.tabs);
	}
	checkForTag(children) {
		return children.some(function(el) {
			return el.type === 'tag' || el.type === 'comment';
		});
	}
	increaseTab() {
		return this.tabs++;
	}
	decreaseTab() {
		return this.tabs--;
	}

	cleanText(string) {
		let clean = super.cleanText(string);
		clean = clean.replace(/\n|\t|^(\s)+$/g, "");
		return clean.replace(/^(\s)+$/g, "");
	}
}

module.exports = H2BFormat;