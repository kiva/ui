const NAMED_ENTITIES = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: '\'',
	nbsp: ' ',
};

export const decodeEntities = text => text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
	if (entity[0] === '#') {
		const codePoint = entity[1].toLowerCase() === 'x'
			? parseInt(entity.slice(2), 16)
			: parseInt(entity.slice(1), 10);
		return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
	}
	return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
});

/**
 * Converts an HTML fragment to plain text without a DOM, so it also runs during server rendering.
 * The result is only safe to render as text, never as HTML.
 *
 * @param {string} html
 * @returns {string}
 */
export default function htmlToText(html) {
	const withoutTags = (html ?? '')
		.replace(/<br\s*\/?>|<\/p>/gi, ' ')
		.replace(/<[^>]*>/g, '');
	return decodeEntities(withoutTags).replace(/\s+/g, ' ').trim();
}
