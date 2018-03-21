/*
 * Load files as es6 template string functions.
 * Based on https://github.com/bradbenvenuti/template-string-loader
 * TODO: switch to using html-loader once v1 is released
 */
var htmlMinifier = require('html-minifier');

module.exports = function(content) {
	this.cacheable && this.cacheable();
	content = htmlMinifier.minify(content, {
		removeComments: true,
		removeCommentsFromCDATA: true,
		removeCDATASectionsFromCDATA: true,
		collapseWhitespace: true,
		removeAttributeQuotes: true,
		useShortDoctype: true,
		keepClosingSlash: true,
		removeScriptTypeAttributes: true,
		removeStyleTypeAttributes: true,
	});
	return 'module.exports = function (context) { with(context) { return `' + content + '`; } };';
}
