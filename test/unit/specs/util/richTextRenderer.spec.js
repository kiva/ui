import {
	removeTrailingParagraphTag,
} from '@/util/contentful/richTextRenderer';

import RichTextField from '../../fixtures/RichTextField.json';

describe('richTextRenderer.js', () => {
	describe('removeTrailingParagraphTag', () => {
		it('returns a rich text object without the empty trailing paragraph tag', () => {
			expect(removeTrailingParagraphTag(RichTextField)).toStrictEqual({
				nodeType: 'document',
				data: {},
				content: [
					{
						nodeType: 'heading-1',
						content: [
							{
								nodeType: 'text',
								value: 'Headline',
								marks: [],
								data: {}
							}
						],
						data: {}
					},
					{
						nodeType: 'paragraph',
						content: [
							{
								nodeType: 'text',
								value: '',
								marks: [],
								data: {}
							}
						],
						data: {}
					},
					{
						nodeType: 'heading-2',
						content: [
							{
								nodeType: 'text',
								value: 'Fund people to improve their lives and build a greener future.',
								marks: [],
								data: {}
							}
						],
						data: {}
					},
				]
			});
		});
	});
});
