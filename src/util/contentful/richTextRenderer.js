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
		const isRichTextContent = contentfulEntryNode?.data?.target?.sys?.contentType?.sys?.id === 'richTextContent';
		const isButton = contentfulEntryNode?.data?.target?.sys?.contentType?.sys?.id === 'button';
		if (isRichTextContent) {
			const richTextHTML = richTextRenderer(contentfulEntryNode?.data?.target?.fields?.richText);
			return `
				<div class="tw-prose tw-whitespace-pre-wrap">${richTextHTML}</div>
			`;
		}
		if (isButton) {
			const analyticsClickEvent = contentfulEntryNode?.data?.target?.fields?.analyticsClickEvent;
			const webClickEventName = contentfulEntryNode?.data?.target?.fields?.webClickEventName;

			const analyticsDirective = () => {
				return analyticsClickEvent ? `v-kv-track-event="['${analyticsClickEvent.join("','")}']"` : '';
			};

			const clickFunctionality = () => {
				if (webClickEventName) {
					return `@click="buttonClick('${webClickEventName}', $event)"`;
				}
				return `href="${contentfulEntryNode?.data?.target?.fields?.webLink ?? '#'}"`;
			};
			return `
				<kv-button
					variant="${contentfulEntryNode?.data?.target?.fields?.style ?? 'primary'}"
					${analyticsDirective()}
					${clickFunctionality()}
				>${contentfulEntryNode?.data?.target?.fields?.label ?? ''}</kv-button>
			`;
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
			}
		}
	};
	return documentToHtmlString(content, options);
}
