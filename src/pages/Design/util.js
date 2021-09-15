import { richTextRenderer } from '@/util/contentful/richTextRenderer';

/* eslint-disable import/prefer-default-export */
export const parseRichTextFromContentGroup = contentGroup => {
	const content = contentGroup?.contents?.find(({ contentType }) => {
		return contentType ? contentType === 'richTextContent' : null;
	});
	const richText = content?.richText ?? null;
	return richText ? richTextRenderer(richText) : '';
};
