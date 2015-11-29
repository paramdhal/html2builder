var H2BConvert, H2BFormat, htmlparser,
	extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	hasProp = {}.hasOwnProperty;

H2BConvert = require('./h2bconvert');

htmlparser = require('htmlparser2');

H2BFormat = (function(superClass) {
	extend(H2BFormat, superClass);

	function H2BFormat() {
		return H2BFormat.__super__.constructor.apply(this, arguments);
	}

	H2BFormat.prototype.setInput = function(input) {
		H2BFormat.__super__.setInput.apply(this, arguments);
		return this.tabs = 0;
	};

	H2BFormat.prototype.getOutput = function() {
		H2BFormat.__super__.getOutput.apply(this, arguments);
		return this.output.trim();
	};

	H2BFormat.prototype.tag = function(item) {
		var attribs, children, comma, extra, name, newline, tabs;
		name = H2BConvert.capitalize(item.name);
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
		tabs = this.setTabs(this.tabs);
		children = this.checkForTag(item.children);
		if (children) {
			newline = '\n';
		} else {
			newline = '';
		}
		if (children) {
			this.increaseTab();
		}
		this.output += tabs + "@w" + name + "(" + extra + attribs + comma + newline;
		this.children(item.children);
		if (!children) {
			tabs = "";
		}
		this.output += tabs + ")\n";
		if (children) {
			return this.decreaseTab();
		}
	};

	H2BFormat.prototype.text = function(item) {
		var tabs, text;
		text = this.cleanText(item.data);
		tabs = '';
		if (text === ' ' || text === '') {
			text = '';
		} else {
			if (item.parent && this.checkForTag(item.parent.children)) {
				tabs = this.setTabs(this.tabs);
			}
			text = tabs + text;
			if (item.next !== null || item.prev !== null) {
				text = text + '\n';
			}
		}
		return this.output += text;
	};

	H2BFormat.prototype.comment = function(item) {
		var comment, tabs;
		comment = this.cleanText(item.data);
		tabs = this.setTabs(this.tabs);
		this.output += tabs + "@wcomment(" + comment + ")";
		return this.output += "\n";
	};

	H2BFormat.prototype.increaseTab = function() {
		return this.tabs++;
	};

	H2BFormat.prototype.decreaseTab = function() {
		return this.tabs--;
	};

	H2BFormat.prototype.setTabs = function(n) {
		return '\t'.repeat(n);
	};

	H2BFormat.prototype.checkForTag = function(children) {
		return children.some(function(el) {
			return el.type === 'tag' || el.type === 'comment';
		});
	};

	H2BFormat.prototype.cleanText = function(string) {
		var clean;
		clean = string.replace(/@/g, "{|@|}");
		clean = clean.replace(/,/g, "{,}");
		clean = clean.replace(/\n|\t|^(\s)+$/g, "");
		return clean = clean.replace(/^(\s)+$/g, "");
	};

	return H2BFormat;

})(H2BConvert);

module.exports = H2BFormat;