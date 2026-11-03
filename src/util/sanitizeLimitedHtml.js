import { decodeEntities } from '#src/util/htmlToText';

const ESCAPES = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
};

const escapeHtml = text => text.replace(/[&<>"']/g, char => ESCAPES[char]);

const VOID_TAGS = new Set(['br']);
const ALLOWED_TAGS = new Set(['a', 'b', 'br', 'p']);

const getSafeHref = attributes => {
	const match = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
	const href = decodeEntities(match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
	return /^(https?:\/\/|\/)/i.test(href) ? href : null;
};

const openTag = (tag, attributes) => {
	if (tag !== 'a') {
		return `<${tag}>`;
	}
	const href = getSafeHref(attributes);
	return href ? `<a href="${escapeHtml(href)}" rel="nofollow noopener">` : '<a>';
};

/**
 * Sanitizes an HTML fragment down to b, br, p and a (with an http(s) or root-relative href only), escaping
 * everything else. Every tag it emits is balanced. Runs without a DOM, so it also works during server rendering.
 *
 * @param {string} html
 * @returns {string} HTML that is safe to render with v-html
 */
export default function sanitizeLimitedHtml(html) {
	const source = (html ?? '')
		.trim()
		.replace(/<!--[\s\S]*?(-->|$)/g, '')
		.replace(/<(script|style)\b[\s\S]*?(<\/\1\s*>|$)/gi, '');
	const tagPattern = /<(\/?)([a-z][a-z0-9]*)\b([^>]*)>/gi;
	const open = [];
	let output = '';
	let lastIndex = 0;
	let match = tagPattern.exec(source);

	while (match) {
		const [whole, closing, name, attributes] = match;
		const tag = name.toLowerCase();
		output += escapeHtml(decodeEntities(source.slice(lastIndex, match.index)));
		lastIndex = match.index + whole.length;

		if (ALLOWED_TAGS.has(tag)) {
			if (VOID_TAGS.has(tag)) {
				output += closing ? '' : `<${tag}>`;
			} else if (!closing) {
				open.push(tag);
				output += openTag(tag, attributes);
			} else if (open.includes(tag)) {
				while (open.length) {
					const last = open.pop();
					output += `</${last}>`;
					if (last === tag) {
						break;
					}
				}
			}
		}
		match = tagPattern.exec(source);
	}

	output += escapeHtml(decodeEntities(source.slice(lastIndex)));
	return output + open.reverse().map(tag => `</${tag}>`).join('');
}
