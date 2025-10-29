import {
	removeTrailingParagraphTag,
	richTextRenderer,
	addBlankTargetToExternalLinks,
} from '../../../../src/util/contentful/richTextRenderer';

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

	describe('richTextRenderer', () => {
		it('renders rich text with embedded image asset', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'paragraph',
					data: {},
					content: [{
						nodeType: 'embedded-asset-block',
						data: {
							target: {
								fields: {
									file: {
										url: '//images.ctfassets.net/test.jpg',
										contentType: 'image/jpeg',
										details: {
											image: {
												width: 800,
												height: 600
											}
										}
									},
									description: 'Test image'
								}
							}
						},
						content: []
					}]
				}]
			};

			const result = richTextRenderer(content);
			expect(result).toContain('kv-contentful-img');
			expect(result).toContain('//images.ctfassets.net/test.jpg');
			expect(result).toContain('Test image');
			expect(result).toContain('height="600"');
			expect(result).toContain('width="800"');
		});

		it('renders rich text with embedded video asset', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'paragraph',
					data: {},
					content: [{
						nodeType: 'embedded-asset-block',
						data: {
							target: {
								fields: {
									file: {
										url: '//videos.ctfassets.net/test.mp4',
										contentType: 'video/mp4'
									}
								}
							}
						},
						content: []
					}]
				}]
			};

			const result = richTextRenderer(content);
			expect(result).toContain('<video');
			expect(result).toContain('//videos.ctfassets.net/test.mp4');
			expect(result).toContain('autoplay');
			expect(result).toContain('loop');
			expect(result).toContain('muted');
		});

		it('renders rich text with embedded richTextContent entry', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'embedded-entry-block',
					data: {
						target: {
							sys: {
								contentType: {
									sys: {
										id: 'richTextContent'
									}
								}
							},
							fields: {
								richText: {
									nodeType: 'document',
									data: {},
									content: [{
										nodeType: 'paragraph',
										data: {},
										content: [{
											nodeType: 'text',
											value: 'Nested content',
											marks: [],
											data: {}
										}]
									}]
								}
							}
						}
					},
					content: []
				}]
			};

			const result = richTextRenderer(content);
			expect(result).toContain('<div>');
			expect(result).toContain('Nested content');
		});

		it('renders rich text with embedded button entry', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'embedded-entry-block',
					data: {
						target: {
							sys: {
								contentType: {
									sys: {
										id: 'button'
									}
								}
							},
							fields: {
								label: 'Click me',
								url: '/test'
							}
						}
					},
					content: []
				}]
			};

			const result = richTextRenderer(content);
			expect(result).toContain('button-wrapper');
			expect(result).toContain('Click me');
			expect(result).toContain('/test');
		});

		it('renders rich text with embedded responsiveImageSet entry', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'embedded-entry-block',
					data: {
						target: {
							sys: {
								contentType: {
									sys: {
										id: 'responsiveImageSet'
									}
								}
							},
							fields: {
								description: 'Responsive image',
								images: [{
									fields: {
										title: 'default',
										file: {
											url: '//images.ctfassets.net/responsive.jpg',
											details: {
												image: {
													width: 1200,
													height: 800
												}
											}
										}
									}
								}]
							}
						}
					},
					content: []
				}]
			};

			const result = richTextRenderer(content);
			expect(result).toContain('kv-contentful-img');
			expect(result).toContain('Responsive image');
		});

		it('renders rich text with embedded FAQ entry', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'embedded-entry-block',
					data: {
						target: {
							sys: {
								contentType: {
									sys: {
										id: 'contentGroup'
									}
								}
							},
							fields: {
								type: 'frequentlyAskedQuestions',
								contents: [{
									sys: {
										contentType: {
											sys: {
												id: 'richTextContent'
											}
										}
									},
									fields: {
										key: 'question1',
										richText: {
											nodeType: 'document',
											data: {},
											content: []
										}
									}
								}]
							}
						}
					},
					content: []
				}]
			};

			const result = richTextRenderer(content);
			expect(result).toContain('kv-frequently-asked-questions');
		});

		it('returns empty string for unknown asset type', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'paragraph',
					data: {},
					content: [{
						nodeType: 'embedded-asset-block',
						data: {
							target: {
								fields: {
									file: {
										url: '//assets.ctfassets.net/file.pdf',
										contentType: 'application/pdf'
									}
								}
							}
						},
						content: []
					}]
				}]
			};

			const result = richTextRenderer(content);
			// Should not contain any rendered asset
			expect(result).not.toContain('kv-contentful-img');
			expect(result).not.toContain('<video');
		});

		it('returns empty string for unknown entry type', () => {
			const content = {
				nodeType: 'document',
				data: {},
				content: [{
					nodeType: 'embedded-entry-block',
					data: {
						target: {
							sys: {
								contentType: {
									sys: {
										id: 'unknownType'
									}
								}
							},
							fields: {}
						}
					},
					content: []
				}]
			};

			const result = richTextRenderer(content);
			// Should handle gracefully
			expect(typeof result).toBe('string');
		});
	});

	describe('addBlankTargetToExternalLinks', () => {
		it('adds target="_blank" to links when enableBlankTargetLinks is true', () => {
			const mockLink = {
				target: ''
			};
			const bodyCopy = {
				querySelectorAll: vi.fn().mockReturnValue([mockLink])
			};
			const pageSettings = {
				enableBlankTargetLinks: true
			};

			addBlankTargetToExternalLinks(bodyCopy, pageSettings);

			expect(bodyCopy.querySelectorAll).toHaveBeenCalledWith('a');
			expect(mockLink.target).toBe('_blank');
		});

		it('does not modify links when enableBlankTargetLinks is false', () => {
			const mockLink = {
				target: ''
			};
			const bodyCopy = {
				querySelectorAll: vi.fn().mockReturnValue([mockLink])
			};
			const pageSettings = {
				enableBlankTargetLinks: false
			};

			addBlankTargetToExternalLinks(bodyCopy, pageSettings);

			expect(bodyCopy.querySelectorAll).not.toHaveBeenCalled();
			expect(mockLink.target).toBe('');
		});

		it('does nothing when bodyCopy is null', () => {
			const pageSettings = {
				enableBlankTargetLinks: true
			};

			// Should not throw
			expect(() => addBlankTargetToExternalLinks(null, pageSettings)).not.toThrow();
		});

		it('does nothing when pageSettings is null', () => {
			const bodyCopy = {
				querySelectorAll: vi.fn()
			};

			// Should not throw
			expect(() => addBlankTargetToExternalLinks(bodyCopy, null)).not.toThrow();
			expect(bodyCopy.querySelectorAll).not.toHaveBeenCalled();
		});

		it('handles multiple links', () => {
			const mockLink1 = { target: '' };
			const mockLink2 = { target: '' };
			const mockLink3 = { target: '_self' };
			const bodyCopy = {
				querySelectorAll: vi.fn().mockReturnValue([mockLink1, mockLink2, mockLink3])
			};
			const pageSettings = {
				enableBlankTargetLinks: true
			};

			addBlankTargetToExternalLinks(bodyCopy, pageSettings);

			expect(mockLink1.target).toBe('_blank');
			expect(mockLink2.target).toBe('_blank');
			expect(mockLink3.target).toBe('_blank');
		});
	});
});
