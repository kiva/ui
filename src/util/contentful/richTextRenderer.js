/* eslint-disable import/prefer-default-export */
/*
 * Custom renderer for Contentful Rich Text content
 * Has the ability to return html for embedded assets
 * and entries inside of that rich text content.
 * Docs: https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer#usage
 */

import { BLOCKS, INLINES } from '~/@contentful/rich-text-types';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

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
 * Returns html string from rich text nodes
 *
 * @param {object} content Content of a contentful rich text field
 * @returns {string} String of html to render
 */
export function richTextRenderer(content) {
	const options = {
		renderNode: {
			[INLINES.EMBEDDED_ENTRY]: node => {
				return `<div class="tw-prose">${richTextRenderer(node?.data?.target?.fields?.richText)}</div>`;
			},
			[BLOCKS.EMBEDDED_ENTRY]: node => {
				return `<div class="tw-prose">${richTextRenderer(node?.data?.target?.fields?.richText)}</div>`;
			},
			[BLOCKS.EMBEDDED_ASSET]: node => {
				return assetRenderer(node?.data?.target?.fields);
			}
		}
	};
	return documentToHtmlString(content, options);
}
