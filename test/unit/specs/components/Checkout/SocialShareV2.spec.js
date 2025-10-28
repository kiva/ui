import { render } from '@testing-library/vue';
import SocialShareV2 from '#src/components/Checkout/SocialShareV2';

// Mock KvBlueskyIcon
vi.mock('@kiva/kv-components', () => ({
	KvBlueskyIcon: 'mock-bluesky-icon',
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span class="kv-material-icon"></span>',
		props: ['icon', 'class'],
	},
}));

// Mock social sharing mixin
vi.mock('#src/plugins/social-sharing-mixin', () => ({
	default: {
		methods: {
			facebookShareUrl: vi.fn(() => 'https://facebook.com/share'),
			blueskyShareUrl: vi.fn(() => 'https://bsky.app/share'),
			linkedInShareUrl: vi.fn(() => 'https://linkedin.com/share'),
			showSharePopUp: vi.fn(),
			copyLink: vi.fn(),
			handleFacebookResponse: vi.fn(),
		},
	},
}));

// Mock Apollo
const mockApollo = {
	query: vi.fn(),
};

// Mock components
const KvIcon = {
	name: 'KvIcon',
	template: '<svg class="kv-icon"><use /></svg>',
	props: ['name', 'title', 'class'],
};

const global = {
	provide: {
		apollo: mockApollo,
	},
	stubs: {
		KvIcon,
	},
};

describe('SocialShareV2.vue', () => {
	const mockLender = {
		firstName: 'John',
		lastName: 'Doe',
		inviterName: 'john_doe',
		public: true,
	};

	const mockLoans = [
		{
			id: 123,
			name: 'Maria',
			unreservedAmount: 100,
			geocode: {
				city: 'Lima',
				country: {
					name: 'Peru',
				},
			},
		},
		{
			id: 456,
			name: 'Jose',
			unreservedAmount: 50,
			geocode: {
				city: 'Quito',
				country: {
					name: 'Ecuador',
				},
			},
		},
	];

	it('exports a valid Vue component', () => {
		expect(SocialShareV2).toBeDefined();
		expect(SocialShareV2.name).toBe('SocialShareV2');
	});

	it('requires lender prop', () => {
		expect(SocialShareV2.props.lender.required).toBe(true);
	});

	it('requires loans prop', () => {
		expect(SocialShareV2.props.loans.required).toBe(true);
	});

	it('has isGuest prop with default false', () => {
		expect(SocialShareV2.props.isGuest.default).toBe(false);
	});

	it('renders the share section', () => {
		const { container } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const section = container.querySelector('.share');
		expect(section).toBeTruthy();
	});

	it('renders the share headline with borrower name', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const headline = getByTestId('share-headline');
		expect(headline.textContent).toContain('Maria');
		expect(headline.textContent).toContain('spread the word');
	});

	it('renders Facebook share button', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-facebook-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Share');
	});

	it('renders Bluesky share button', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-bluesky-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Share');
	});

	it('renders LinkedIn share button', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-linkedin-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Share');
	});

	it('renders Copy Link button', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-copy-link-button');
		expect(button).toBeTruthy();
		expect(button.textContent).toContain('Copy Link');
	});

	it('renders KvIcon for Facebook', () => {
		const { container } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const icons = container.querySelectorAll('.kv-icon');
		expect(icons.length).toBeGreaterThan(0);
	});

	it('has selectedLoan computed property', () => {
		expect(SocialShareV2.computed.selectedLoan).toBeDefined();
	});

	it('has selectedLoanId computed property', () => {
		expect(SocialShareV2.computed.selectedLoanId).toBeDefined();
	});

	it('has shareSubtitle computed property', () => {
		expect(SocialShareV2.computed.shareSubtitle).toBeDefined();
	});

	it('has utmContent computed property', () => {
		expect(SocialShareV2.computed.utmContent).toBeDefined();
	});

	it('renders share subtitle with borrower name', () => {
		const { container } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const subtitle = container.querySelector('.share__small__message');
		expect(subtitle.textContent).toContain('Maria');
	});

	it('applies hide-for-print class', () => {
		const { container } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const section = container.querySelector('.hide-for-print');
		expect(section).toBeTruthy();
	});

	it('applies social__btn--facebook class', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-facebook-button');
		expect(button.className).toContain('social__btn--facebook');
	});

	it('applies social__btn--bluesky class', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-bluesky-button');
		expect(button.className).toContain('social__btn--bluesky');
	});

	it('applies social__btn--linkedin class', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-linkedin-button');
		expect(button.className).toContain('social__btn--linkedin');
	});

	it('applies tw-text-link class to copy button', () => {
		const { getByTestId } = render(SocialShareV2, {
			props: {
				lender: mockLender,
				loans: mockLoans,
			},
			global,
		});

		const button = getByTestId('share-copy-link-button');
		expect(button.className).toContain('tw-text-link');
	});

	it('has onLoanSelect method', () => {
		expect(SocialShareV2.methods.onLoanSelect).toBeDefined();
	});

	it('has useSuggestedMessage method', () => {
		expect(SocialShareV2.methods.useSuggestedMessage).toBeDefined();
	});

	it('has copyStatus in data', () => {
		expect(SocialShareV2.data).toBeDefined();
	});
});
