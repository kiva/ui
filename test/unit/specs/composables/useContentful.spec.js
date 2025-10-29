import useContentful from '../../../../src/composables/useContentful';

vi.mock('#src/util/logReadQueryError');

describe('useContentful.js', () => {
	let mockApollo;
	let composable;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn(),
		};
		composable = useContentful(mockApollo);
	});

	describe('getMostRecentBlogPost', () => {
		it('should fetch and return the most recent blog post for a category', async () => {
			const mockPost = {
				sys: { id: 'post-123' },
				fields: {
					title: 'Test Blog Post',
					image: {
						fields: {
							file: {
								url: '//images.ctfassets.net/test.jpg'
							}
						}
					},
					category: {
						fields: {
							shortName: 'News'
						}
					},
					originalPublishDate: '2025-10-15',
					slug: 'test-blog-post'
				}
			};

			mockApollo.query.mockResolvedValue({
				data: {
					contentful: {
						blogPosts: {
							items: [mockPost]
						}
					}
				}
			});

			const result = await composable.getMostRecentBlogPost('news');

			expect(mockApollo.query).toHaveBeenCalledTimes(1);
			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: {
					customFields: expect.stringContaining('fields.category.fields.slug=news'),
					limit: 1,
					skip: 0
				}
			});

			expect(result).toEqual({
				id: 'post-123',
				title: 'Test Blog Post',
				image: '//images.ctfassets.net/test.jpg',
				category: 'News',
				date: '2025-10-15',
				slug: 'test-blog-post'
			});
		});

		it('should return null when no blog post is found', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					contentful: {
						blogPosts: {
							items: []
						}
					}
				}
			});

			const result = await composable.getMostRecentBlogPost('nonexistent');

			expect(result).toBeNull();
		});

		it('should handle missing optional fields', async () => {
			const mockPost = {
				sys: { id: 'post-456' },
				fields: {
					title: 'Minimal Post',
					originalPublishDate: '2025-10-20',
					slug: 'minimal-post'
				}
			};

			mockApollo.query.mockResolvedValue({
				data: {
					contentful: {
						blogPosts: {
							items: [mockPost]
						}
					}
				}
			});

			const result = await composable.getMostRecentBlogPost('test');

			expect(result).toEqual({
				id: 'post-456',
				title: 'Minimal Post',
				image: undefined,
				category: undefined,
				date: '2025-10-20',
				slug: 'minimal-post'
			});
		});

		it('should return null when data structure is unexpected', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					contentful: null
				}
			});

			const result = await composable.getMostRecentBlogPost('test');

			expect(result).toBeNull();
		});

		it('should return null and log error when query fails', async () => {
			const mockError = new Error('GraphQL Error');
			mockApollo.query.mockRejectedValue(mockError);

			const result = await composable.getMostRecentBlogPost('test');

			expect(result).toBeNull();
		});

		it('should construct correct customFields query string', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					contentful: {
						blogPosts: {
							items: []
						}
					}
				}
			});

			await composable.getMostRecentBlogPost('technology');

			const callArgs = mockApollo.query.mock.calls[0][0];
			expect(callArgs.variables.customFields).toContain('fields.category.sys.contentType.sys.id=blogCategory');
			expect(callArgs.variables.customFields).toContain('fields.category.fields.slug=technology');
			expect(callArgs.variables.customFields).toContain('order=-fields.originalPublishDate');
		});

		it('should handle deep nested image path safely', async () => {
			const mockPost = {
				sys: { id: 'post-789' },
				fields: {
					title: 'Image Test',
					image: {
						fields: {
							file: null
						}
					},
					originalPublishDate: '2025-10-22',
					slug: 'image-test'
				}
			};

			mockApollo.query.mockResolvedValue({
				data: {
					contentful: {
						blogPosts: {
							items: [mockPost]
						}
					}
				}
			});

			const result = await composable.getMostRecentBlogPost('test');

			expect(result.image).toBeUndefined();
		});
	});
});
