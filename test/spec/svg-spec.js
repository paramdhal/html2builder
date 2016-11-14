import { isSVG } from '../../app/js/src/svg';

describe('isSVG', function() {;
	it('should return true for svg elements', function() {
		var validElements = ['path', 'g', 'fePointLight', 'feDisplacementMap'];
		validElements.forEach((element) => expect(isSVG(element)).toBe(true));
	});
	it('should return false for non svg elements', function() {
		var validElements = ['div', 'header', 'foo', 'bar'];
		validElements.forEach((element) => expect(isSVG(element)).toBe(false));
	});
});