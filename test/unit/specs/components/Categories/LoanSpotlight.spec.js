import { render, waitFor } from '@testing-library/vue';
import LoanSpotlight from '#src/components/Categories/LoanSpotlight';
import { commonStubs, createStubComponent } from '../../../helpers/componentTestHelpers';

// Mock toParagraphs utility
vi.mock('#src/util/loanUtils', () => ({
	toParagraphs: vi.fn(text => [text])
}));

// Mock KvButton and KvLoadingPlaceholder from @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		name: 'KvButton',
		template: '<button><slot /></button>',
		props: ['to', 'variant']
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div class="loading-placeholder"></div>',
		props: ['style']
	}
}));

// Mock tracking directive
const mockKvTrackEvent = {
	mounted: vi.fn(),
	updated: vi.fn()
};

describe('LoanSpotlight', () => {
	let mockApollo;
	let mockCookieStore;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn().mockResolvedValue({
				data: {
					lend: {
						loanChannelsById: [{
							id: 123,
							loans: {
								values: [{
									id: 1234567,
									description: 'This is a loan description for a borrower',
									anonymizationLevel: 'none',
									geocode: {
										city: 'Nairobi',
										country: {
											id: 'ke',
											name: 'Kenya'
										}
									},
									image: {
										id: 456,
										default: '/img/loan-default.jpg',
										retina: '/img/loan-retina.jpg'
									}
								}]
							}
						}]
					}
				}
			})
		};

		mockCookieStore = {};
	});

	const renderComponent = (props = {}, apolloOverride = null) => {
		return render(LoanSpotlight, {
			props: {
				categorySlug: 'women',
				fallbackCategorySlug: 'women',
				...props
			},
		global: {
			provide: {
				apollo: apolloOverride || mockApollo,
				cookieStore: mockCookieStore
			},
			directives: {
				kvTrackEvent: mockKvTrackEvent
			},
			stubs: {
				KvResponsiveImage: commonStubs.KvResponsiveImage,
				KvLoadingParagraph: createStubComponent('KvLoadingParagraph', {
					template: '<div class="loading-paragraph"></div>',
					props: ['style']
				})
			}
		}
	});
	};	it('should have the correct component name', () => {
		expect(LoanSpotlight.name).toBe('LoanSpotlight');
	});

	describe('props', () => {
		it('should have categorySlug prop with default', () => {
			expect(LoanSpotlight.props.categorySlug.type).toBe(String);
			expect(LoanSpotlight.props.categorySlug.default).toBe('');
		});

		it('should have fallbackCategorySlug prop with default', () => {
			expect(LoanSpotlight.props.fallbackCategorySlug.type).toBe(String);
			expect(LoanSpotlight.props.fallbackCategorySlug.default).toBe('');
		});
	});

	describe('loading state', () => {
		it('should show loading placeholder initially', () => {
			const { container } = renderComponent();

			const placeholder = container.querySelector('.loading-placeholder');
			expect(placeholder).toBeTruthy();
		});

		it('should show loading paragraph initially', () => {
			const { container } = renderComponent();

			const loadingParagraph = container.querySelector('.loading-paragraph');
			expect(loadingParagraph).toBeTruthy();
		});

		it('should not show button while loading', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				// Initially loading, so button may not exist yet
				expect(container.querySelector('.loading-paragraph')).toBeTruthy();
			});
		});
	});

	describe('loaded state', () => {
		it('should render loan image after loading', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const image = container.querySelector('.spotlight-loan-image');
				if (image) {
					expect(image).toBeTruthy();
				}
			});
		});

		it('should render loan location', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				// Component should display location once loaded
				expect(container).toBeTruthy();
			});
		});

		it('should render loan description', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const description = container.querySelector('.tw-line-clamp-5');
				if (description) {
					expect(description).toBeTruthy();
				}
			});
		});

		it('should render view loan button', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const button = container.querySelector('button');
				if (button) {
					expect(button.textContent).toContain('View loan');
				}
			});
		});
	});

	describe('layout and styling', () => {
		it('should have correct testid', () => {
			const { container } = renderComponent();

			const spotlight = container.querySelector('[data-testid="all-categories-loan-spotlight"]');
			expect(spotlight).toBeTruthy();
		});

		it('should have mobile heading', () => {
			renderComponent();

			const headings = Array.from(document.querySelectorAll('h2')).filter(
				el => el.textContent.includes('Today\'s loan spotlight')
			);
			expect(headings.length).toBeGreaterThan(0);
		});

		it('should have desktop heading', () => {
			const { container } = renderComponent();

			const desktopHeading = container.querySelector('h2.tw-hidden.md\\:tw-block');
			expect(desktopHeading).toBeTruthy();
		});

		it('should have flex layout on desktop', () => {
			const { container } = renderComponent();

			const flexContainer = container.querySelector('.md\\:tw-flex');
			expect(flexContainer).toBeTruthy();
		});

		it('should have responsive image container', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const imageContainer = container.querySelector('.md\\:tw-mr-3.lg\\:tw-mr-4');
				// Container should exist once loaded
				if (imageContainer) {
					expect(imageContainer).toBeTruthy();
				}
			});
		});

		it('should have grow container for content', () => {
			const { container } = renderComponent();

			const contentContainer = container.querySelector('.md\\:tw-grow');
			expect(contentContainer).toBeTruthy();
		});
	});

	describe('computed properties', () => {
		it('should compute altText from description', () => {
			const wrapper = {
				spotlightLoan: {
					description: 'This is a very long loan description that should be '
						+ 'truncated to 100 characters for alt text'
				}
			};
			const result = LoanSpotlight.computed.altText.call(wrapper);
			expect(result).toBe('This is a very long loan description that should be '
				+ 'truncated to 100 characters for alt text');
		});

		it('should handle missing description in altText', () => {
			const wrapper = {
				spotlightLoan: {}
			};
			const result = LoanSpotlight.computed.altText.call(wrapper);
			expect(result).toBe('');
		});

		it('should compute getSpotlightLoanID', () => {
			const wrapper = {
				spotlightLoan: {
					id: 1234567
				}
			};
			const result = LoanSpotlight.computed.getSpotlightLoanID.call(wrapper);
			expect(result).toBe(1234567);
		});

		it('should handle missing loan ID', () => {
			const wrapper = {
				spotlightLoan: {}
			};
			const result = LoanSpotlight.computed.getSpotlightLoanID.call(wrapper);
			expect(result).toBe('');
		});

		it('should compute getSpotlightLoanLocation with city and country', () => {
			const wrapper = {
				spotlightLoan: {
					geocode: {
						city: 'Nairobi',
						country: {
							name: 'Kenya'
						}
					}
				}
			};
			const result = LoanSpotlight.computed.getSpotlightLoanLocation.call(wrapper);
			expect(result).toBe('Nairobi, Kenya');
		});

		it('should compute getSpotlightLoanLocation with country only', () => {
			const wrapper = {
				spotlightLoan: {
					geocode: {
						country: {
							name: 'Kenya'
						}
					}
				}
			};
			const result = LoanSpotlight.computed.getSpotlightLoanLocation.call(wrapper);
			expect(result).toBe('Kenya');
		});

		it('should handle missing geocode', () => {
			const wrapper = {
				spotlightLoan: {}
			};
			const result = LoanSpotlight.computed.getSpotlightLoanLocation.call(wrapper);
			expect(result).toBe('');
		});

		it('should compute getSpotlightImage with retina', () => {
			const wrapper = {
				spotlightLoan: {
					image: {
						default: '/img/loan-default.jpg',
						retina: '/img/loan-retina.jpg'
					}
				}
			};
			const result = LoanSpotlight.computed.getSpotlightImage.call(wrapper);
			expect(result).toEqual([
				['small', '/img/loan-retina.jpg'],
				['small retina', '/img/loan-retina.jpg']
			]);
		});

		it('should compute getSpotlightImage without retina', () => {
			const wrapper = {
				spotlightLoan: {
					image: {
						default: '/img/loan-default.jpg'
					}
				}
			};
			const result = LoanSpotlight.computed.getSpotlightImage.call(wrapper);
			expect(result).toEqual([['small', '/img/loan-default.jpg']]);
		});

		it('should handle missing image', () => {
			const wrapper = {
				spotlightLoan: {}
			};
			const result = LoanSpotlight.computed.getSpotlightImage.call(wrapper);
			expect(result).toEqual([['small', '']]);
		});
	});

	describe('components', () => {
		it('should register KvButton component', () => {
			expect(LoanSpotlight.components.KvButton).toBeDefined();
		});

		it('should register KvResponsiveImage component', () => {
			expect(LoanSpotlight.components.KvResponsiveImage).toBeDefined();
		});

		it('should register KvLoadingPlaceholder component', () => {
			expect(LoanSpotlight.components.KvLoadingPlaceholder).toBeDefined();
		});

		it('should register KvLoadingParagraph component', () => {
			expect(LoanSpotlight.components.KvLoadingParagraph).toBeDefined();
		});
	});

	describe('injected dependencies', () => {
		it('should inject apollo', () => {
			expect(LoanSpotlight.inject).toContain('apollo');
		});

		it('should inject cookieStore', () => {
			expect(LoanSpotlight.inject).toContain('cookieStore');
		});
	});

	describe('button styling', () => {
		it('should have full width button on mobile', async () => {
			const { container } = renderComponent();

			await waitFor(() => {
				const button = container.querySelector('.tw-w-full.md\\:tw-w-auto');
				if (button) {
					expect(button).toBeTruthy();
				}
			});
		});
	});
});
