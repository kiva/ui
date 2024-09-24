/*
 * Load files as es6 template string functions.
 * Based on https://github.com/bradbenvenuti/template-string-loader
 * TODO: switch to using html-loader once v1 is released
 */
import * as htmlMinifier from 'html-minifier';

export default function templateStringLoader(content) {
	if (typeof this.cacheable === 'function') {
		this.cacheable();
	}
	const minifiedContent = htmlMinifier.minify(content, {
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
	return `module.exports = function (context) { with(context) { return \`${minifiedContent}\`; } };`;
}
