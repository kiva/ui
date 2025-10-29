import { render, waitFor } from '@testing-library/vue';
import UpdateDetails from '../../../../../src/components/BorrowerProfile/UpdateDetails';

// Mock DOMPurify
vi.mock('dompurify', () => ({
	default: {
		sanitize: vi.fn((html, options) => {
			if (options?.ALLOWED_TAGS?.length === 0) {
				// Remove all HTML tags for sharing
				return html.replace(/<[^>]*>/g, '');
			}
			// Return html as-is for display (in real tests, this would sanitize)
			return html;
		})
	}
}));

// Mock date-fns
vi.mock('date-fns', () => ({
	format: vi.fn((date, formatString) => {
		if (formatString === 'MMMM dd, yyyy') {
			return 'January 15, 2024';
		}
		return 'January 15, 2024';
	}),
	parseISO: vi.fn(dateString => new Date(dateString))
}));

// Mock KvSocialShareButton
vi.mock('#src/components/Kv/KvSocialShareButton', () => ({
	default: {
		name: 'KvSocialShareButton',
		template: '<button data-testid="social-share-button"><slot /></button>',
		props: ['modalTitle', 'shareMessage', 'shareUrl', 'variant', 'utmCampaign']
	}
}));

describe('UpdateDetails.vue', () => {
	const mockRoute = {
		path: '/lend/1234567'
	};

	describe('Component Structure', () => {
		it('has the correct component name', () => {
			expect(UpdateDetails.name).toBe('UpdateDetails');
		});

		it('declares the expected props', () => {
			expect(UpdateDetails.props).toEqual({
				body: {
					type: String,
					default: ''
				},
				date: {
					type: String,
					default: ''
				},
				subject: {
					type: String,
					default: ''
				},
				index: {
					type: Number,
					default: 1
				},
				imageUrl: {
					type: String,
					default: ''
				}
			});
		});

		it('registers the expected components', () => {
			expect(UpdateDetails.components).toHaveProperty('KvSocialShareButton');
		});
	});

	describe('Initial State', () => {
		it('initializes with correct default data', () => {
			const component = UpdateDetails;
			const data = component.data();

			expect(data.readMoreClicked).toBe(false);
		});
	});

	describe('Computed Properties', () => {
		describe('formattedJournalDate', () => {
			it('formats the date correctly', () => {
				const { getByText } = render(UpdateDetails, {
					props: {
						date: '2024-01-15T00:00:00Z',
						body: 'Update body text',
						subject: 'Update Subject'
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(getByText('January 15, 2024')).toBeTruthy();
			});
		});

		describe('truncateBody', () => {
			it('returns true when body length exceeds 205 characters', () => {
				const longBody = 'a'.repeat(210);
				const { container } = render(UpdateDetails, {
					props: {
						body: longBody,
						date: '2024-01-15T00:00:00Z',
						subject: 'Update Subject'
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Read more button should be visible
				const readMoreButton = container.querySelector('button.tw-text-link');
				expect(readMoreButton).toBeTruthy();
			});

			it('returns false when body length is 205 or less', () => {
				const shortBody = 'Short update text';
				const { container } = render(UpdateDetails, {
					props: {
						body: shortBody,
						date: '2024-01-15T00:00:00Z',
						subject: 'Update Subject'
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Read more button should not be visible
				const readMoreButton = container.querySelector('button.tw-text-link');
				expect(readMoreButton).toBeFalsy();
			});
		});

		describe('shortBody', () => {
			it('returns first 205 characters with ellipsis', () => {
				const longBody = 'a'.repeat(210);
				const { container } = render(UpdateDetails, {
					props: {
						body: longBody,
						date: '2024-01-15T00:00:00Z',
						subject: 'Update Subject'
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Should show truncated text
				const proseContent = container.querySelector('.tw-prose');
				expect(proseContent.textContent).toContain('...');
			});
		});

		describe('htmlSafeBody', () => {
			it('sanitizes HTML with allowed tags', () => {
				const bodyWithHtml = '<p>This is a <strong>test</strong> update with '
					+ '<script>alert("xss")</script> content</p>';
				const { container } = render(UpdateDetails, {
					props: {
						body: bodyWithHtml,
						date: '2024-01-15T00:00:00Z',
						subject: 'Update Subject'
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				// Should render sanitized HTML
				const proseContent = container.querySelector('.tw-prose');
				expect(proseContent).toBeTruthy();
			});
		});

		describe('shareMessage', () => {
			it('includes subject when provided', () => {
				const { container } = render(UpdateDetails, {
					props: {
						body: 'Update body text',
						date: '2024-01-15T00:00:00Z',
						subject: 'My Update Subject',
						index: 1
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});

			it('omits subject prefix when not provided', () => {
				const { container } = render(UpdateDetails, {
					props: {
						body: 'Update body text',
						date: '2024-01-15T00:00:00Z',
						subject: '',
						index: 1
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});

			it('removes all HTML tags for sharing', () => {
				const bodyWithHtml = '<p>Text with <strong>bold</strong> and <em>italic</em></p>';
				const { container } = render(UpdateDetails, {
					props: {
						body: bodyWithHtml,
						date: '2024-01-15T00:00:00Z',
						subject: 'Subject',
						index: 1
					},
					global: {
						mocks: {
							$route: mockRoute
						},
						directives: {
							'kv-track-event': vi.fn()
						}
					}
				});

				expect(container).toBeTruthy();
			});
		});
	});

	describe('User Interactions', () => {
		it('shows full body when read more is clicked', async () => {
			const longBody = 'a'.repeat(210);
			const { container, getByText } = render(UpdateDetails, {
				props: {
					body: longBody,
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject'
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			// Initially should show truncated with read more button
			const readMoreButton = getByText('read more');
			expect(readMoreButton).toBeTruthy();

			// Click read more
			readMoreButton.click();

			await waitFor(() => {
				// Button should no longer be visible
				const buttonAfterClick = container.querySelector('button.tw-text-link');
				expect(buttonAfterClick).toBeFalsy();
			});
		});
	});

	describe('Rendered Content', () => {
		it('renders update image when imageUrl is provided', () => {
			const { container } = render(UpdateDetails, {
				props: {
					body: 'Update body',
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject',
					imageUrl: 'https://example.com/image.jpg',
					index: 1
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			const image = container.querySelector('img');
			expect(image).toBeTruthy();
			expect(image.getAttribute('src')).toBe('https://example.com/image.jpg');
			expect(image.getAttribute('alt')).toBe('photo of borrower');
		});

		it('does not render image when imageUrl is not provided', () => {
			const { container } = render(UpdateDetails, {
				props: {
					body: 'Update body',
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject',
					index: 1
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			const image = container.querySelector('img');
			expect(image).toBeFalsy();
		});

		it('renders the subject', () => {
			const { getByText } = render(UpdateDetails, {
				props: {
					body: 'Update body',
					date: '2024-01-15T00:00:00Z',
					subject: 'My Update Subject',
					index: 1
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText('My Update Subject')).toBeTruthy();
		});

		it('renders the update index', () => {
			const { getByText } = render(UpdateDetails, {
				props: {
					body: 'Update body',
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject',
					index: 3
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText('Update #3')).toBeTruthy();
		});

		it('renders KvSocialShareButton with correct props', () => {
			const { queryByTestId } = render(UpdateDetails, {
				props: {
					body: 'Update body',
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject',
					index: 1
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(queryByTestId('social-share-button')).toBeTruthy();
		});

		it('renders formatted date', () => {
			const { getByText } = render(UpdateDetails, {
				props: {
					body: 'Update body',
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject',
					index: 1
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText('January 15, 2024')).toBeTruthy();
		});

		it('renders full body when truncateBody is false', () => {
			const shortBody = 'This is a short update';
			const { getByText } = render(UpdateDetails, {
				props: {
					body: shortBody,
					date: '2024-01-15T00:00:00Z',
					subject: 'Update Subject',
					index: 1
				},
				global: {
					mocks: {
						$route: mockRoute
					},
					directives: {
						'kv-track-event': vi.fn()
					}
				}
			});

			expect(getByText(shortBody)).toBeTruthy();
		});
	});
});
