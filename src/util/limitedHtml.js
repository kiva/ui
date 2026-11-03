// Helpers for the limited HTML (b, br, p, a) that borrower updates are written in. Neither needs a DOM, so both
// run during server rendering, where DOMPurify cannot.

const NAMED_ENTITIES = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: '\'',
	nbsp: ' ',
};

const ESCAPES = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
};

const ALLOWED_TAGS = new Set(['a', 'b', 'p']);
const INLINE_TAGS = new Set(['a', 'b']);

const TOKEN_PATTERN = new RegExp([
	/<!--[\s\S]*?(?:-->|$)/.source,
	/<(script|style)\b[\s\S]*?(?:<\/\1\s*>|$)/.source,
	/<(\/?)([a-z][a-z0-9]*)\b([^>]*)>/.source,
].join('|'), 'gi');

const decodeEntities = text => text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
	if (entity[0] === '#') {
		const codePoint = entity[1].toLowerCase() === 'x'
			? parseInt(entity.slice(2), 16)
			: parseInt(entity.slice(1), 10);
		return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
	}
	return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
});

const escapeHtml = text => text.replace(/[&<>"']/g, char => ESCAPES[char]);

/**
 * Splits HTML into decoded text and tag tokens, dropping comments and script and style elements with their content.
 *
 * @param {string} html
 * @returns {Array<{ text: string }|{ tag: string, closing: boolean, attributes: string }>}
 */
const tokenize = html => {
	const source = html ?? '';
	const tokens = [];
	const pushText = text => {
		if (text) {
			tokens.push({ text: decodeEntities(text) });
		}
	};
	let lastIndex = 0;
	Array.from(source.matchAll(TOKEN_PATTERN)).forEach(match => {
		const [whole, , closing, name, attributes] = match;
		pushText(source.slice(lastIndex, match.index));
		lastIndex = match.index + whole.length;
		if (name) {
			tokens.push({ tag: name.toLowerCase(), closing: !!closing, attributes });
		}
	});
	pushText(source.slice(lastIndex));
	return tokens;
};

const BREAK = { tag: 'br' };

const isBreak = node => node.tag === 'br';

const isBlank = node => node.text !== undefined && !node.text.trim();

const findNeighbour = (nodes, index, step) => {
	let i = index + step;
	while (i >= 0 && i < nodes.length && (isBlank(nodes[i]) || INLINE_TAGS.has(nodes[i].tag))) {
		i += step;
	}
	return nodes[i];
};

const isBreakBoundary = node => !node || node.tag === 'p';

const normalizeBreaks = nodes => {
	const collapsed = nodes.filter((node, index) => !isBreak(node) || !isBreak(findNeighbour(nodes, index, -1) ?? {}));
	const trimmed = collapsed.filter((node, index) => !isBreak(node) || (
		!isBreakBoundary(findNeighbour(collapsed, index, -1))
		&& !isBreakBoundary(findNeighbour(collapsed, index, 1))
	));
	const withoutEmptyParagraphs = trimmed.filter((node, index) => {
		if (node.tag !== 'p') {
			return true;
		}
		const neighbour = findNeighbour(trimmed, index, node.closing ? -1 : 1);
		return !(neighbour?.tag === 'p' && neighbour.closing !== node.closing);
	});
	return withoutEmptyParagraphs.filter((node, index, all) => !isBlank(node)
		|| !isBreakBoundary(all[index - 1])
		|| !isBreakBoundary(all[index + 1]));
};

const getSafeHref = attributes => {
	const match = (attributes ?? '').match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
	const href = decodeEntities(match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
	return /^(https?:\/\/|\/)/i.test(href) ? href : null;
};

const serialize = node => {
	if (node.text !== undefined) {
		return escapeHtml(node.text);
	}
	if (node.closing) {
		return `</${node.tag}>`;
	}
	if (node.tag === 'a') {
		const href = getSafeHref(node.attributes);
		return href ? `<a href="${escapeHtml(href)}" rel="nofollow noopener">` : '<a>';
	}
	return `<${node.tag}>`;
};

/**
 * Converts limited HTML to plain text. The result is only safe to render as text, never as HTML.
 *
 * @param {string} html
 * @returns {string}
 */
export function htmlToText(html) {
	return tokenize(html)
		.map(token => token.text ?? (token.tag === 'br' || token.tag === 'p' ? ' ' : ''))
		.join('')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Sanitizes HTML down to b, br, p and a (with an http(s) or root-relative href only), escaping everything else and
 * balancing every tag it keeps. Newlines become breaks, runs of breaks collapse to one, breaks at the edges of the
 * fragment or a paragraph are dropped, and so are empty paragraphs.
 *
 * @param {string} html
 * @returns {string} HTML that is safe to render with v-html
 */
export function sanitizeLimitedHtml(html) {
	const nodes = [];
	const open = [];
	const closeThrough = tag => {
		while (open.length) {
			const last = open.pop();
			nodes.push({ tag: last, closing: true });
			if (last === tag) {
				return;
			}
		}
	};

	tokenize(html).forEach(token => {
		if (token.text !== undefined) {
			token.text.split(/\r\n|\r|\n/).forEach((line, index) => {
				if (index) {
					nodes.push(BREAK);
				}
				if (line) {
					nodes.push({ text: line });
				}
			});
		} else if (token.tag === 'br') {
			nodes.push(BREAK);
		} else if (ALLOWED_TAGS.has(token.tag)) {
			if (!token.closing) {
				open.push(token.tag);
				nodes.push(token);
			} else if (open.includes(token.tag)) {
				closeThrough(token.tag);
			}
		}
	});
	closeThrough(null);

	return normalizeBreaks(nodes).map(serialize).join('').trim();
}
