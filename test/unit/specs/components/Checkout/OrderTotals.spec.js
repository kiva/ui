import { render } from '@testing-library/vue';
import OrderTotals from '#src/components/Checkout/OrderTotals';
import {
	commonStubs,
	createStubComponent,
	testComponentStructure
} from '../../../helpers/componentTestHelpers';

const mockTotals = {
	itemTotal: '100.00',
	kivaCreditAppliedTotal: '0.00',
	kivaCreditToReapply: '0.00',
	loanReservationTotal: 1,
	redemptionCodeAppliedTotal: '0.00',
	redemptionCodeAvailableTotal: '0.00',
	universalCodeAppliedTotal: '0.00',
	universalCodeAvailableTotal: '0.00',
	bonusAppliedTotal: '0.00',
	bonusAvailableTotal: '0.00',
	creditAmountNeeded: '100.00',
	creditAppliedTotal: '0.00',
	creditAvailableTotal: '0.00',
};

const global = {
	mocks: {
		$kvTrackEvent: vi.fn(),
	},
	stubs: {
		// Stub complex child components to isolate OrderTotals testing:
		// - KvTooltip: has KvPopper/KvThemeProvider dependencies
		// - DonationItem: 481-line complex component, not needed for OrderTotals logic
		KvTooltip: commonStubs.KvTooltip,
		DonationItem: createStubComponent('DonationItem', {
			props: ['donation', 'orderTotalVariant', 'loanCount', 'loanReservationTotal'],
			template: '<div class="donation-item"></div>'
		}),
	},
};

describe('OrderTotals.vue', () => {
	// Consolidated structure tests
	testComponentStructure(OrderTotals, {
		name: 'OrderTotals',
		props: ['totals', 'promoFund', 'openLightbox'],
		computed: [
			'showRemoveKivaCredit',
			'showApplyKivaCredit',
			'showKivaCredit',
			'kivaCredit',
			'itemTotal',
			'creditAmountNeeded',
			'hasRedemptionCode',
			'hasUPCCode',
			'hasBonusCredit',
			'showPromoCreditTotal'
		],
		data: {
			promoOptOutLightboxVisible: false,
			donateItemExperimentVersion: 'a'
		}
	});

	it('renders order totals container', () => {
		const { container } = render(OrderTotals, {
			props: {
				totals: mockTotals,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const wrapper = container.querySelector('.tw-mb-1');
		expect(wrapper).toBeTruthy();
	});

	it('renders Order Total when promo credit is shown', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		expect(container.textContent).toContain('Order Total:');
	});

	it('displays formatted item total', () => {
		const { container } = render(OrderTotals, {
			props: {
				totals: mockTotals,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		expect(container.textContent).toContain('$100.00');
	});

	it('applies tw-flex class to totals row', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const flexRow = container.querySelector('.tw-flex');
		expect(flexRow).toBeTruthy();
	});

	it('applies tw-text-h3 class when not corporate campaign', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const h3Text = container.querySelector('.tw-text-h3');
		expect(h3Text).toBeTruthy();
	});

	it('applies tw-float-right class to amount', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const floatRight = container.querySelector('.tw-float-right');
		expect(floatRight).toBeTruthy();
	});

	it('applies data-testid for basket-order-total', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { getByTestId } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		expect(getByTestId('basket-order-total')).toBeTruthy();
	});

	it('applies tw-mb-2 class to order total row', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const mbRow = container.querySelector('.tw-mb-2');
		expect(mbRow).toBeTruthy();
	});

	it('applies tw-w-full class to order total row', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const fullWidth = container.querySelector('.tw-w-full');
		expect(fullWidth).toBeTruthy();
	});

	it('applies tw-text-right class to amount', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const textRight = container.querySelector('.tw-text-right');
		expect(textRight).toBeTruthy();
	});

	it('applies tw-pl-2 class to amount span', () => {
		const totalsWithPromo = {
			...mockTotals,
			redemptionCodeAppliedTotal: '25.00',
		};

		const { container } = render(OrderTotals, {
			props: {
				totals: totalsWithPromo,
				promoFund: {},
				openLightbox: vi.fn(),
			},
			global,
		});

		const paddingLeft = container.querySelector('.tw-pl-2');
		expect(paddingLeft).toBeTruthy();
	});
});
