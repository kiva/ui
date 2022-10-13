/* eslint-disable import/prefer-default-export */
/*
 * Custom renderer for Contentful Rich Text content
 * Has the ability to return html for embedded assets
 * and entries inside of that rich text content.
 * Docs: https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer#usage
 */

import {
	formatResponsiveImageSet, responsiveImageSetSourceSets, formatContentTypes
} from '@/util/contentfulUtils';
import { BLOCKS, INLINES } from '~/@contentful/rich-text-types';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

/**
 * Returns a string representation of a value
 * which can be inserted in an html attribute in quotes.
 * Call stringify, then replaces single quotes with escaped
 * then replaces double quotes with single quotes
 *
 * @param {string|object|array} value any value to convert to string
 * @returns {string} string representation
 */
function htmlSafeStringify(value) {
	return JSON.stringify(value).replace(/'/g, '\\\'').replace(/"/g, '\'');
}

/**
 * Contentful rich text fields add a trailing empty <p> tag, these should be removed
 *
 * @param {object} contentful RTF object containing RTF nodes
 * @returns {object} RTF object containing RTF nodes without trailing empty <p> tag
 */
export function removeTrailingParagraphTag(content) {
	if (content) {
		// Remove empty <p> inserted by contentful
		const innerContent = content?.content;
		const lastRTFElement = innerContent[innerContent.length - 1];

		const contentWithoutTrailingEmptyParagraph = { ...content };

		// If last item is an empty paragraph, which contains an empty text node, remove it
		if (lastRTFElement.nodeType === 'paragraph'
			&& Object.keys(lastRTFElement.data).length === 0
			&& lastRTFElement.content.length === 1
			&& lastRTFElement.content?.[0]?.value === ''
			&& lastRTFElement.content?.[0]?.nodeType === 'text') {
			contentWithoutTrailingEmptyParagraph.content = contentWithoutTrailingEmptyParagraph.content.slice(0, -1);
		}
		return contentWithoutTrailingEmptyParagraph;
	}
	return content;
}

/**
 * Returns html string from rich text nodes
 *
 * @param {object} content Content of a contentful rich text field
 * @returns {string} String of html to render
 */
export function richTextRenderer(content) {
	/**
	 * Returns html string to render a contentful asset as a vue component
	 *
	 * @param {object} contentfulAssetObject Content of a contentful asset object
	 * @returns {string} String of html to render
	 */
	const assetRenderer = contentfulAssetObject => {
		const isVideo = contentfulAssetObject?.file?.contentType.includes('video');
		const isImage = contentfulAssetObject?.file?.contentType.includes('image');
		if (isImage) {
			return `
			<kv-contentful-img
				class="tw-whitespace-normal"
				contentful-src="${encodeURI(contentfulAssetObject?.file?.url)}"
				alt="${contentfulAssetObject?.description}"
				height="${contentfulAssetObject?.file?.details?.image?.height}"
				width="${contentfulAssetObject?.file?.details?.image?.width}"/>
			`;
		} if (isVideo) {
		// video media
			return `
			<video
				:src="${encodeURI(contentfulAssetObject?.file?.url)}"
				autoplay
				loop
				muted
				playsinline
			></video>`;
		}
		return '';
	};

	/**
	 * Returns html string to render a contentful entry, possibly as a vue component
	 *
	 * @param {object} contentfulEntryNode Contentful rich text node for an entry
	 * @returns {string} String of html to render
	 */
	const entryRenderer = contentfulEntryNode => {
		const entryContentTypeId = contentfulEntryNode?.data?.target?.sys?.contentType?.sys?.id;
		const entryContent = contentfulEntryNode?.data?.target;

		const isRichTextContent = entryContentTypeId === 'richTextContent';
		const isButton = entryContentTypeId === 'button';
		const isResponsiveImageSet = entryContentTypeId === 'responsiveImageSet';
		const isFAQ = entryContent?.fields?.type === 'frequentlyAskedQuestions';

		if (isRichTextContent) {
			const richTextHTML = richTextRenderer(entryContent?.fields?.richText);
			return `<div>${richTextHTML}</div>`;
		}
		if (isButton) {
			// The content prop expects an object, but in this context
			// only passing in a string representation of an object will work
			// We must stringify the object, then replace the quotes
			// eslint-disable-next-line max-len
			const buttonObjectAsString = htmlSafeStringify(entryContent?.fields);
			return `<button-wrapper class="tw-whitespace-normal" :content="${buttonObjectAsString}" />`;
		}
		if (isResponsiveImageSet) {
			const formattedResponsiveImageSet = formatResponsiveImageSet(entryContent);
			const sourceSets = responsiveImageSetSourceSets(formattedResponsiveImageSet);
			const sourceSetArrayAsString = htmlSafeStringify(sourceSets);
			return `<kv-contentful-img
						class="tw-whitespace-normal"
						contentful-src="${encodeURI(sourceSets[0].url)}"
						width="${sourceSets[0].width}"
						height="${sourceSets[0].height}"
						fallback-format="jpg"
						alt="${formattedResponsiveImageSet?.description}"
						:source-sizes="${sourceSetArrayAsString}" />`;
		}
		if (isFAQ) {
			return `<kv-frequently-asked-questions
						:questions="${htmlSafeStringify(formatContentTypes(entryContent?.fields?.contents))}"
					/>`;
		}
		return '';
	};

	const options = {
		renderNode: {
			[INLINES.EMBEDDED_ENTRY]: node => {
				return entryRenderer(node);
			},
			[BLOCKS.EMBEDDED_ENTRY]: node => {
				return entryRenderer(node);
			},
			[BLOCKS.EMBEDDED_ASSET]: node => {
				return assetRenderer(node?.data?.target?.fields);
			},
		}
	};

	const contentWithoutTrailingEmptyParagraph = removeTrailingParagraphTag(content);

	return documentToHtmlString(contentWithoutTrailingEmptyParagraph, options);
}

/* eslint-disable import/prefer-default-export */
/**
 * Adds target="_blank" to links so they open in a new tab
 *
 * @param {String} bodyCopy String containing html of contentful entry
 * @param {Object} pageSettings Object containing global page settings of
 * the page that the contentful entry is from
 * @returns {void}
 */
export function addBlankTargetToExternalLinks(bodyCopy, pageSettings) {
	// make sure all partner content links open externally
	if (bodyCopy && pageSettings?.enableBlankTargetLinks) {
		const links = bodyCopy.querySelectorAll('a');
		if (links.length > 0) {
			Array.prototype.forEach.call(links, link => {
				link.target = '_blank';// eslint-disable-line no-param-reassign
			});
		}
	}
}
