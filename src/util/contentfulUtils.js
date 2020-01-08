import _get from 'lodash/get';

/**
 * Takes raw contentful content field, and returns an object with keys mapped to the content type.
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
// eslint-disable-next-line import/prefer-default-export
export function processContent(contentfulContent) {
	const contentfulContentObject = {};
	contentfulContent.forEach(item => {
		const	itemKey = _get(item, 'sys.contentType.sys.id');
		contentfulContentObject[itemKey] = item.fields;
	});
	return contentfulContentObject;
}
