// Helpers for the HTML that borrower updates are stored as. Neither needs a DOM, so both run during server
// rendering, where DOMPurify cannot.

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

const INLINE_TAGS = new Set(['a', 'b', 'strong', 'i', 'em']);
const BLOCK_TAGS = new Set(['p', 'ul', 'ol', 'li', 'blockquote']);
const PARAGRAPH_TAGS = new Set([
	'address', 'article', 'center', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'footer',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'pre', 'section', 'table', 'td', 'th', 'tr',
]);

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

const toKeptTag = tag => (PARAGRAPH_TAGS.has(tag) ? 'p' : tag);

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
const PARAGRAPH_BREAK = { paragraphBreak: true };

const isBreak = node => node?.tag === 'br';

const isBlank = node => node?.text !== undefined && !node.text.trim();

const isBlockBoundary = node => !node || BLOCK_TAGS.has(node.tag);

const findNeighbour = (nodes, index, step) => {
	let i = index + step;
	while (i >= 0 && i < nodes.length && (isBlank(nodes[i]) || INLINE_TAGS.has(nodes[i].tag))) {
		i += step;
	}
	return nodes[i];
};

// A <br> and the newline written beside it in the source are one line break
const withoutNewlinesBesideBreaks = tokens => tokens.map((token, index) => {
	if (token.text === undefined) {
		return token;
	}
	let { text } = token;
	if (tokens[index - 1]?.tag === 'br') {
		text = text.replace(/^[ \t]*(\r\n|\r|\n)/, '');
	}
	if (tokens[index + 1]?.tag === 'br') {
		text = text.replace(/(\r\n|\r|\n)[ \t]*$/, '');
	}
	return { text };
});

const isEdge = token => isBreak(token) || isBlank(token);

const withLineBreaks = tokens => {
	const lines = withoutNewlinesBesideBreaks(tokens).flatMap(token => {
		if (token.tag === 'br') {
			return [BREAK];
		}
		if (token.text === undefined) {
			return [token];
		}
		return token.text.split(/\r\n|\r|\n/).flatMap((line, index) => [
			...(index ? [BREAK] : []),
			...(line ? [{ text: line }] : []),
		]);
	});
	const start = lines.findIndex(token => !isEdge(token));
	const end = lines.length - [...lines].reverse().findIndex(token => !isEdge(token));
	return start === -1 ? [] : lines.slice(start, end);
};

// Runs of two or more breaks, with only whitespace between, become one paragraph break
const withParagraphBreaks = tokens => tokens.reduce((result, token, index) => {
	if (!isBreak(token)) {
		result.push(token);
		return result;
	}
	const breakBefore = isBreak(findNeighbour(tokens, index, -1));
	const breakAfter = isBreak(findNeighbour(tokens, index, 1));
	if (!breakBefore) {
		result.push(breakAfter ? PARAGRAPH_BREAK : token);
	}
	return result;
}, []);

const buildBalancedNodes = (tokens, wrapInParagraphs) => {
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
	const openTag = (tag, attributes) => {
		open.push(tag);
		nodes.push({ tag, attributes });
	};

	if (wrapInParagraphs) {
		openTag('p');
	}
	tokens.forEach(token => {
		if (token.paragraphBreak) {
			closeThrough('p');
			openTag('p');
			return;
		}
		if (token.text !== undefined || isBreak(token)) {
			nodes.push(token);
			return;
		}
		const tag = toKeptTag(token.tag);
		if (!INLINE_TAGS.has(tag) && !BLOCK_TAGS.has(tag)) {
			return;
		}
		if (token.closing) {
			if (open.includes(tag)) {
				closeThrough(tag);
			}
			return;
		}
		// The browser parser closes an open paragraph before any block, and an open list item before the next one
		if (BLOCK_TAGS.has(tag) && open.includes('p')) {
			closeThrough('p');
		}
		if (tag === 'li' && open.lastIndexOf('li') > Math.max(open.lastIndexOf('ul'), open.lastIndexOf('ol'))) {
			closeThrough('li');
		}
		openTag(tag, token.attributes);
	});
	closeThrough(null);
	return nodes;
};

const normalizeBreaks = nodes => {
	const collapsed = nodes.filter((node, index) => !isBreak(node) || !isBreak(findNeighbour(nodes, index, -1)));
	const trimmed = collapsed.filter((node, index) => !isBreak(node) || (
		!isBlockBoundary(findNeighbour(collapsed, index, -1))
		&& !isBlockBoundary(findNeighbour(collapsed, index, 1))
	));
	const withoutEmptyParagraphs = trimmed.filter((node, index) => {
		if (node.tag !== 'p') {
			return true;
		}
		const neighbour = findNeighbour(trimmed, index, node.closing ? -1 : 1);
		return !(neighbour?.tag === 'p' && neighbour.closing !== node.closing);
	});
	return withoutEmptyParagraphs.filter((node, index, all) => !isBlank(node)
		|| !isBlockBoundary(all[index - 1])
		|| !isBlockBoundary(all[index + 1]));
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
 * Converts update HTML to plain text, keeping words apart across breaks and blocks.
 * The result is only safe to render as text, never as HTML.
 *
 * @param {string} html
 * @returns {string}
 */
export function htmlToText(html) {
	return tokenize(html)
		.map(token => {
			if (token.text !== undefined) {
				return token.text;
			}
			const tag = toKeptTag(token.tag);
			return tag === 'br' || BLOCK_TAGS.has(tag) ? ' ' : '';
		})
		.join('')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Sanitizes update HTML down to paragraphs, lists, blockquotes, breaks, emphasis and links (with an http(s) or
 * root-relative href only), escaping everything else. Other block elements become paragraphs, tags are nested the way
 * the browser parser would nest them, and plain text without blocks is split into paragraphs on blank lines.
 * Remaining runs of breaks collapse to one, and breaks at block edges and empty paragraphs are dropped.
 *
 * @param {string} html
 * @returns {string} HTML that is safe to render with v-html
 */
export function sanitizeLimitedHtml(html) {
	const tokens = withLineBreaks(tokenize(html));
	const hasBlocks = tokens.some(token => BLOCK_TAGS.has(toKeptTag(token.tag)));
	const paragraphTokens = hasBlocks ? [] : withParagraphBreaks(tokens);
	const nodes = paragraphTokens.some(token => token.paragraphBreak)
		? buildBalancedNodes(paragraphTokens, true)
		: buildBalancedNodes(tokens, false);
	return normalizeBreaks(nodes).map(serialize).join('').trim();
}
