import { render } from '@testing-library/vue';
import CheckoutHolidayPromo from '#src/components/Checkout/CheckoutHolidayPromo';

// Mock GraphQL mutation
vi.mock('#src/graphql/mutation/shopAddOnePrintKivaCard.graphql', () => ({
	default: { kind: 'Document' },
}));

// Mock Apollo client
const mockApollo = {
	mutate: vi.fn(() => Promise.resolve({
		data: {
			shop: {
				addOnePrintKivaCard: true,
			},
		},
	})),
};

// Mock KvIcon component
const KvIcon = {
	name: 'KvIcon',
	template: '<svg :class="customClass" class="kv-icon"><use /></svg>',
	props: {
		name: String,
		class: String,
	},
	computed: {
		customClass() {
			return this.class || '';
		},
	},
};

const global = {
	provide: {
		apollo: mockApollo,
	},
	stubs: {
		KvIcon,
	},
	mocks: {
		$kvTrackEvent: vi.fn(),
	},
};

describe('CheckoutHolidayPromo.vue', () => {
	it('exports a valid Vue component', () => {
		expect(CheckoutHolidayPromo).toBeDefined();
		expect(CheckoutHolidayPromo.name).toBe('CheckoutHolidayPromo');
	});

	it('renders the holiday promo container', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const promo = container.querySelector('.checkout-holiday-promo');
		expect(promo).toBeTruthy();
	});

	it('renders the present icon', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const icon = container.querySelector('.kv-icon');
		expect(icon).toBeTruthy();
	});

	it('renders the holiday message', () => {
		const { getByText } = render(CheckoutHolidayPromo, { global });

		expect(getByText(/Give hope this holiday season/i)).toBeTruthy();
	});

	it('renders the add Kiva Card button', () => {
		const { getByText } = render(CheckoutHolidayPromo, { global });

		const button = getByText(/Add a \$25 Kiva Card to your cart/i);
		expect(button).toBeTruthy();
		expect(button.tagName).toBe('BUTTON');
	});

	it('applies tw-flex class', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const promo = container.querySelector('.tw-flex');
		expect(promo).toBeTruthy();
	});

	it('applies tw-justify-center class', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const promo = container.querySelector('.tw-justify-center');
		expect(promo).toBeTruthy();
	});

	it('applies tw-mb-4 class', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const promo = container.querySelector('.tw-mb-4');
		expect(promo).toBeTruthy();
	});

	it('has addOnePrintKivaCard method', () => {
		expect(CheckoutHolidayPromo.methods.addOnePrintKivaCard).toBeDefined();
	});

	it('emits updating-totals event', () => {
		expect(CheckoutHolidayPromo.emits).toContain('updating-totals');
	});

	it('applies tw-text-link class to button', () => {
		const { getByText } = render(CheckoutHolidayPromo, { global });

		const button = getByText(/Add a \$25 Kiva Card to your cart/i);
		expect(button.className).toContain('tw-text-link');
	});

	it('applies tw-w-3 class to icon', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const icon = container.querySelector('.holiday-present-icon');
		expect(icon).toBeTruthy();
		expect(icon.className).toContain('tw-w-3');
	});

	it('applies tw-h-3 class to icon', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const icon = container.querySelector('.holiday-present-icon');
		expect(icon).toBeTruthy();
		expect(icon.className).toContain('tw-h-3');
	});

	it('applies tw-mr-2 class to icon', () => {
		const { container } = render(CheckoutHolidayPromo, { global });

		const icon = container.querySelector('.holiday-present-icon');
		expect(icon).toBeTruthy();
		expect(icon.className).toContain('tw-mr-2');
	});
});
