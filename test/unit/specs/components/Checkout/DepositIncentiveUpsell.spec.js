import { render } from '@testing-library/vue';
import DepositIncentiveUpsell from '#src/components/Checkout/DepositIncentiveUpsell';

const mockLoans = [
	{
		id: 123,
		name: 'Maria',
		image: {
			id: 'img1',
			url: 'https://example.com/loan1.jpg',
			retinaUrl: 'https://example.com/loan1@2x.jpg',
			lgUrl: 'https://example.com/loan1-lg.jpg',
			lgRetinaUrl: 'https://example.com/loan1-lg@2x.jpg',
		},
		geocode: {
			country: {
				id: 'PE',
				name: 'Peru',
			},
		},
	},
	{
		id: 456,
		name: 'John',
		image: {
			id: 'img2',
			url: 'https://example.com/loan2.jpg',
			retinaUrl: 'https://example.com/loan2@2x.jpg',
			lgUrl: 'https://example.com/loan2-lg.jpg',
			lgRetinaUrl: 'https://example.com/loan2-lg@2x.jpg',
		},
		geocode: {
			country: {
				id: 'KE',
				name: 'Kenya',
			},
		},
	},
];

const global = {
	provide: {
		apollo: {
			mutate: vi.fn(() => Promise.resolve({ data: {} })),
			query: vi.fn(() => Promise.resolve({
				data: {
					fundraisingLoans: {
						values: mockLoans,
					},
				},
			})),
		},
	},
	mocks: {
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
	},
	directives: {
		'kv-track-event': vi.fn(),
	},
	stubs: {
		KvIcon: {
			name: 'KvIcon',
			props: ['name', 'id'],
			template: '<svg :id="id" class="kv-icon"><use /></svg>',
		},
		KvButton: {
			name: 'KvButton',
			props: ['state', 'variant'],
			template: '<button :disabled="state === \'disabled\'" class="kv-button"><slot /></button>',
		},
		KvCarousel: {
			name: 'KvCarousel',
			props: ['multipleSlidesVisible', 'slidesToScroll', 'emblaOptions'],
			template: `<div class="kv-carousel">
				<slot name="slide1" />
				<slot name="slide2" />
				<slot name="slide3" />
				<slot name="slide4" />
			</div>`,
		},
		KvLoadingPlaceholder: {
			name: 'KvLoadingPlaceholder',
			template: '<div class="kv-loading-placeholder"></div>',
		},
		KvProgressBar: {
			name: 'KvProgressBar',
			props: ['value', 'ariaLabel'],
			template: '<div class="kv-progress-bar" :aria-label="ariaLabel" :data-value="value"></div>',
		},
	},
};

describe('DepositIncentiveUpsell.vue', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders Earn your $25 Reward headline', () => {
		const { getByText } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		expect(getByText(/Earn your \$25 Reward/)).toBeTruthy();
	});

	it('renders present icon', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const presentIcon = container.querySelector('#present-icon');
		expect(presentIcon).toBeTruthy();
	});

	it('renders amount left message', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		expect(container.textContent).toContain('away! Don\'t miss out on your free lending credit.');
	});

	it('renders progress bar when not loading', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const progressBar = container.querySelector('.kv-progress-bar');
		expect(progressBar).toBeTruthy();
	});

	it('renders carousel for loan slides', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const carousel = container.querySelector('.kv-carousel');
		expect(carousel).toBeTruthy();
	});

	it('renders Add to basket buttons', () => {
		const { getAllByText } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const buttons = getAllByText('Add to basket');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('has name property', () => {
		expect(DepositIncentiveUpsell.name).toBe('DepositIncentiveUpsell');
	});

	it('accepts maxLoans prop', () => {
		expect(DepositIncentiveUpsell.props.maxLoans).toBeDefined();
		expect(DepositIncentiveUpsell.props.maxLoans.type).toBe(Number);
		expect(DepositIncentiveUpsell.props.maxLoans.default).toBe(4);
	});

	it('accepts goal prop', () => {
		expect(DepositIncentiveUpsell.props.goal).toBeDefined();
		expect(DepositIncentiveUpsell.props.goal.type).toBe(Number);
		expect(DepositIncentiveUpsell.props.goal.default).toBe(0);
	});

	it('accepts progress prop', () => {
		expect(DepositIncentiveUpsell.props.progress).toBeDefined();
		expect(DepositIncentiveUpsell.props.progress.type).toBe(Number);
		expect(DepositIncentiveUpsell.props.progress.default).toBe(0);
	});

	it('accepts excludeLoanIds prop', () => {
		expect(DepositIncentiveUpsell.props.excludeLoanIds).toBeDefined();
		expect(DepositIncentiveUpsell.props.excludeLoanIds.type).toBe(Array);
	});

	it('has data properties', () => {
		const component = new DepositIncentiveUpsell.constructor();
		const data = DepositIncentiveUpsell.data.call(component);
		expect(data.loadingLoans).toBe(true);
		expect(data.loans).toEqual([]);
	});

	it('has amountLeft computed property', () => {
		expect(DepositIncentiveUpsell.computed.amountLeft).toBeDefined();
	});

	it('has amountLeftFormatted computed property', () => {
		expect(DepositIncentiveUpsell.computed.amountLeftFormatted).toBeDefined();
	});

	it('has loadingProgress computed property', () => {
		expect(DepositIncentiveUpsell.computed.loadingProgress).toBeDefined();
	});

	it('has progressPercent computed property', () => {
		expect(DepositIncentiveUpsell.computed.progressPercent).toBeDefined();
	});

	it('has displayLoans computed property', () => {
		expect(DepositIncentiveUpsell.computed.displayLoans).toBeDefined();
	});

	it('has addToBasket method', () => {
		expect(DepositIncentiveUpsell.methods.addToBasket).toBeDefined();
	});

	it('has fetchLoans method', () => {
		expect(DepositIncentiveUpsell.methods.fetchLoans).toBeDefined();
	});

	it('calculates amount left correctly', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		expect(container.textContent).toContain('$25');
	});

	it('shows loading placeholders when loading', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 0,
				progress: 0,
				excludeLoanIds: [],
			},
			global,
		});

		const placeholders = container.querySelectorAll('.kv-loading-placeholder');
		expect(placeholders.length).toBeGreaterThan(0);
	});

	it('applies correct styling classes to headline', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const headline = container.querySelector('h3');
		expect(headline).toBeTruthy();
		expect(headline.className).toContain('tw-mb-1');
	});

	it('applies tw-text-small class to progress text', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const progressText = container.querySelector('.tw-text-small');
		expect(progressText).toBeTruthy();
	});

	it('applies tw-inline-flex class to progress paragraph', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const paragraph = container.querySelector('.tw-inline-flex');
		expect(paragraph).toBeTruthy();
	});

	it('applies tw-items-center class to progress paragraph', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const paragraph = container.querySelector('.tw-items-center');
		expect(paragraph).toBeTruthy();
	});

	it('renders with default maxLoans prop', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
			},
			global,
		});

		const buttons = container.querySelectorAll('.kv-button');
		expect(buttons.length).toBeGreaterThan(0);
	});

	it('applies tw-rounded class to loan images', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const imageContainer = container.querySelector('.tw-rounded');
		expect(imageContainer).toBeTruthy();
	});

	it('applies tw-overflow-hidden class to loan images', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const imageContainer = container.querySelector('.tw-overflow-hidden');
		expect(imageContainer).toBeTruthy();
	});

	it('applies tw-bg-secondary class to loan image placeholders', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const imageContainer = container.querySelector('.tw-bg-secondary');
		expect(imageContainer).toBeTruthy();
	});

	it('renders progress bar with correct aria-label', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const progressBar = container.querySelector('.kv-progress-bar');
		expect(progressBar?.getAttribute('aria-label')).toBe('Percent progress towards lending reward');
	});

	it('renders icon with rotation class', () => {
		const { container } = render(DepositIncentiveUpsell, {
			props: {
				goal: 100,
				progress: 75,
				excludeLoanIds: [],
			},
			global,
		});

		const icon = container.querySelector('#present-icon');
		expect(icon?.className).toContain('tw--rotate-12');
	});
});
