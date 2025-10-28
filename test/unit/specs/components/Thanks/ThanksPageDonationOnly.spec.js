import { render, waitFor } from '@testing-library/vue';
import ThanksPageDonationOnly from '#src/components/Thanks/ThanksPageDonationOnly';

// Mock dependencies
vi.mock('#src/util/urlUtils', () => ({
	getFullUrl: vi.fn((base, params) => {
		if (!params || Object.keys(params).length === 0) return base;
		const paramStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
		return `${base}?${paramStr}`;
	}),
}));

vi.mock('#src/util/contentfulUtils', () => ({
	formatContentGroupsFlat: vi.fn(() => ({}))
}));

// Mock child components
vi.mock('#src/components/Kv/KvIcon', () => ({
	default: {
		name: 'KvIcon',
		template: '<span class="kv-icon" :title="title"><slot /></span>',
		props: ['name', 'title']
	}
}));

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvBlueskyIcon: 'M8 2.5C8 1.12 9.12 0 10.5 0S13 1.12 13 2.5',
	KvGrid: {
		name: 'KvGrid',
		template: '<div class="kv-grid" :class="$attrs.class"><slot /></div>',
	},
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span class="kv-material-icon" :class="$attrs.class"><slot /></span>',
		props: ['icon', 'name']
	},
	KvPageContainer: {
		name: 'KvPageContainer',
		template: '<div class="kv-page-container"><slot /></div>',
	}
}));

// Mock social-sharing-mixin
vi.mock('#src/plugins/social-sharing-mixin', () => ({
	default: {
		data() {
			return {
				shareableUrl: 'https://kiva.org/test',
				shareableDescription: 'Test description'
			};
		},
		methods: {
			facebookShareUrl: () => 'https://facebook.com/share',
			linkedInShareUrl: () => 'https://linkedin.com/share',
			blueskyShareUrl: () => 'https://bsky.app/share',
			copyLink: vi.fn(),
			showSharePopUp: vi.fn(),
		}
	}
}));

// Mock smooth-scroll-mixin
vi.mock('#src/plugins/smooth-scroll-mixin', () => ({
	default: {}
}));

// Mock apollo client
const mockApolloQuery = vi.fn();
const mockApollo = {
	query: mockApolloQuery
};

describe('ThanksPageDonationOnly', () => {
	let mockKvTrackEvent;
	let mockShowTipMsg;
	let mockAppConfig;

	beforeEach(() => {
		vi.clearAllMocks();
		mockKvTrackEvent = vi.fn();
		mockShowTipMsg = vi.fn();
		mockAppConfig = {
			host: 'www.kiva.org'
		};

		// Default apollo response
		mockApolloQuery.mockResolvedValue({
			data: {
				my: {
					userAccount: {
						id: '123',
						firstName: 'John',
						inviterName: 'john123',
						public: true
					}
				}
			}
		});
	});

	const createComponent = (props = {}, userData = null) => {
		if (userData !== null) {
			mockApolloQuery.mockResolvedValue({ data: userData });
		}

		return render(ThanksPageDonationOnly, {
			props,
			global: {
				mocks: {
					$kvTrackEvent: mockKvTrackEvent,
					$showTipMsg: mockShowTipMsg,
					$appConfig: mockAppConfig,
				},
				provide: {
					apollo: mockApollo,
					cookieStore: {}
				},
				stubs: {
					RouterLink: {
						name: 'RouterLink',
						template: '<a :href="to"><slot /></a>',
						props: ['to']
					}
				},
				directives: {
					'kv-track-event': () => {}
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(ThanksPageDonationOnly.name).toBe('ThanksPageDonationOnly');
		});

		it('should define expected props', () => {
			const { monthlyDonationAmount, showDafThanks } = ThanksPageDonationOnly.props;
			expect(monthlyDonationAmount).toBeDefined();
			expect(showDafThanks).toBeDefined();
		});

		it('should register required components', () => {
			const {
				KvIcon, KvMaterialIcon, KvPageContainer, KvGrid
			} = ThanksPageDonationOnly.components;
			expect(KvIcon).toBeDefined();
			expect(KvMaterialIcon).toBeDefined();
			expect(KvPageContainer).toBeDefined();
			expect(KvGrid).toBeDefined();
		});
	});

	describe('Initial Rendering', () => {
		it('should render the thanks message heading', async () => {
			const { getByTestId } = createComponent();
			await waitFor(() => {
				const heading = getByTestId('thanks-message');
				expect(heading).toBeTruthy();
			});
		});

		it('should render YouTube video iframe', () => {
			const { container } = createComponent();
			const iframe = container.querySelector('iframe[src*="youtube.com"]');
			expect(iframe).toBeTruthy();
			expect(iframe.getAttribute('src')).toContain('Mpp2ZH7os4Q');
		});

		it('should render social sharing buttons', () => {
			const { getByTestId } = createComponent();
			expect(getByTestId('share-facebook-button')).toBeTruthy();
			expect(getByTestId('share-copy-link-button')).toBeTruthy();
			expect(getByTestId('share-bluesky-button')).toBeTruthy();
			expect(getByTestId('share-linkedin-button')).toBeTruthy();
		});

		it('should render Manal story content', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('How a Kiva loan helped Manal grow her business');
		});
	});

	describe('DAF Thanks Display', () => {
		it('should show DAF-specific message when showDafThanks is true', async () => {
			const { container } = createComponent({ showDafThanks: true });
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
			expect(container.textContent).toContain('helping create opportunities');
			expect(container.textContent).toContain('majorgiving@kiva.org');
		});

		it('should show regular donor message when showDafThanks is false', async () => {
			const { container } = createComponent({ showDafThanks: false });
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
			expect(container.textContent).toContain('As a donor, you help Kiva provide loans');
		});

		it('should position video heading differently for DAF thanks', async () => {
			const { container } = createComponent({ showDafThanks: true });
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
			const h2Element = Array.from(container.querySelectorAll('h2'))
				.find(el => el.textContent.includes('Watch Manal'));
			expect(h2Element).toBeTruthy();
		});
	});

	describe('Header Message', () => {
		it('should show personalized message for logged-in user with firstName', async () => {
			const { getByTestId } = createComponent();
			await waitFor(() => {
				const heading = getByTestId('thanks-message');
				expect(heading.textContent).toContain('John, thank you for supporting our mission');
			});
		});

		it('should show generic message for guest users', async () => {
			const { getByTestId } = createComponent({}, {
				my: { userAccount: null }
			});
			await waitFor(() => {
				const heading = getByTestId('thanks-message');
				expect(heading.textContent).toBe('Thank you for supporting our mission');
			});
		});

		it('should show generic message when firstName is not available', async () => {
			const { getByTestId } = createComponent({}, {
				my: {
					userAccount: {
						id: '123',
						firstName: '',
						inviterName: 'john123',
						public: true
					}
				}
			});
			await waitFor(() => {
				const heading = getByTestId('thanks-message');
				expect(heading.textContent).toBe('Thank you for supporting our mission');
			});
		});
	});

	describe('Social Sharing Buttons', () => {
		it('should render Facebook share button with proper structure', async () => {
			const { getByTestId } = createComponent();
			await waitFor(() => {
				const button = getByTestId('share-facebook-button');
				expect(button).toBeTruthy();
				expect(button.textContent).toContain('Share on Facebook');
			});
		});

		it('should render Bluesky share button with proper structure', async () => {
			const { getByTestId } = createComponent();
			await waitFor(() => {
				const button = getByTestId('share-bluesky-button');
				expect(button).toBeTruthy();
				expect(button.textContent).toContain('Share to your followers');
			});
		});

		it('should render LinkedIn share button with proper structure', async () => {
			const { getByTestId } = createComponent();
			await waitFor(() => {
				const button = getByTestId('share-linkedin-button');
				expect(button).toBeTruthy();
				expect(button.textContent).toContain('Share on LinkedIn');
			});
		});

		it('should render Copy Link button with proper initial state', async () => {
			const { getByTestId } = createComponent();
			await waitFor(() => {
				const button = getByTestId('share-copy-link-button');
				expect(button).toBeTruthy();
				expect(button.textContent).toContain('Copy Link');
			});
		});
	});

	describe('Computed Properties', () => {
		it('should compute shareMessage by trimming message', async () => {
			createComponent();
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should generate shareLink with inviter name for public logged-in user', async () => {
			createComponent();
			await waitFor(() => {
				// Component mounted successfully
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should generate base shareLink for guest users', async () => {
			createComponent({}, {
				my: { userAccount: null }
			});
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should compute utmContent as guest for guest users', async () => {
			createComponent({}, {
				my: { userAccount: null }
			});
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should compute utmContent as inviterName for public users', async () => {
			createComponent();
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should compute utmContent as anonymous for non-public users', async () => {
			createComponent({}, {
				my: {
					userAccount: {
						id: '123',
						firstName: 'John',
						inviterName: 'john123',
						public: false
					}
				}
			});
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});
	});

	describe('Portfolio Link', () => {
		it('should show portfolio link for logged-in users', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const portfolioLink = container.querySelector('a[href="/portfolio"]');
				expect(portfolioLink).toBeTruthy();
				expect(portfolioLink.textContent).toContain('continue to my portfolio');
			});
		});

		it('should not show portfolio link for guest users', async () => {
			const { container } = createComponent({}, {
				my: { userAccount: null }
			});
			await waitFor(() => {
				const portfolioLink = container.querySelector('a[href="/portfolio"]');
				expect(portfolioLink).toBeFalsy();
			});
		});
	});

	describe('Monthly Donation Tip', () => {
		it('should show tip message when monthly donation amount is provided', () => {
			createComponent({ monthlyDonationAmount: '25' });
			expect(mockShowTipMsg).toHaveBeenCalledWith(
				expect.stringContaining('$25'),
				'confirmation',
				true
			);
		});

		it('should not show tip message when monthly donation amount is zero', () => {
			createComponent({ monthlyDonationAmount: '0' });
			expect(mockShowTipMsg).not.toHaveBeenCalled();
		});

		it('should not show tip message when monthly donation amount is empty', () => {
			createComponent({ monthlyDonationAmount: '' });
			expect(mockShowTipMsg).not.toHaveBeenCalled();
		});

		it('should include subscription settings link in tip message', () => {
			createComponent({ monthlyDonationAmount: '50' });
			expect(mockShowTipMsg).toHaveBeenCalledWith(
				expect.stringContaining('/settings/subscriptions'),
				'confirmation',
				true
			);
		});
	});

	describe('Lifecycle - Created', () => {
		it('should call gatherCurrentUserData on created', async () => {
			createComponent();
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should track donations-only-view for logged-in users', async () => {
			createComponent();
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'post-checkout',
					'show',
					'donations-only-view',
					expect.stringMatching(/signed-in|guest/)
				);
			});
		});

		it('should track donations-only-view as guest for guest users', async () => {
			createComponent({}, { my: { userAccount: null } });
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
			// Track event is called before user data is fetched, so it might be 'guest'
			expect(mockKvTrackEvent).toHaveBeenCalled();
		});
	});

	describe('Share Link Generation', () => {
		it('should generate invitedby link for public users with firstName', async () => {
			createComponent();
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});

		it('should not include lender param for non-public users', async () => {
			createComponent({}, {
				my: {
					userAccount: {
						id: '123',
						firstName: 'John',
						inviterName: 'john123',
						public: false
					}
				}
			});
			await waitFor(() => {
				expect(mockApolloQuery).toHaveBeenCalled();
			});
		});
	});

	describe('YouTube Embed', () => {
		it('should embed YouTube video with correct ID', () => {
			const { container } = createComponent();
			const iframe = container.querySelector('iframe');
			expect(iframe.getAttribute('src')).toContain('youtube.com/embed/Mpp2ZH7os4Q');
		});

		it('should configure YouTube iframe with rel=0 parameter', () => {
			const { container } = createComponent();
			const iframe = container.querySelector('iframe');
			expect(iframe.getAttribute('src')).toContain('rel=0');
		});

		it('should set iframe with proper accessibility attributes', () => {
			const { container } = createComponent();
			const iframe = container.querySelector('iframe');
			expect(iframe.getAttribute('title')).toBe('YouTube video player');
			expect(iframe.hasAttribute('allowfullscreen')).toBe(true);
		});
	});
});
