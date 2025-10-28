import { render } from '@testing-library/vue';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';

// Mock child components
const KvIcon = {
	name: 'KvIcon',
	template: '<svg class="kv-icon"><use /></svg>',
	props: ['name', 'id', 'class'],
};

const KvTooltip = {
	name: 'KvTooltip',
	template: '<div class="kv-tooltip"><slot /></div>',
	props: ['controller', 'theme'],
};

const KvButton = {
	name: 'KvButton',
	template: '<a class="kv-button"><slot /></a>',
	props: ['href', 'target', 'class'],
};

const global = {
	stubs: {
		KvIcon,
		KvTooltip,
		KvButton,
		RouterLink: {
			template: '<a><slot /></a>',
			props: ['to'],
		},
	},
	mocks: {
		$kvTrackEvent: vi.fn(),
	},
};

describe('CheckoutReceipt.vue', () => {
	const mockLender = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
	};

	const mockReceipt = {
		transactionTime: '2024-01-01T12:00:00Z',
		items: {
			values: [
				{
					id: 123,
					basketItemType: 'loan_reservation',
					price: 25,
					loan: {
						name: 'Maria',
						use: 'buy supplies for her store',
						geocode: {
							city: 'Lima',
							country: {
								name: 'Peru',
							},
						},
					},
				},
				{
					id: 1,
					basketItemType: 'kiva_card',
					price: 25,
					kivaCardObject: {
						deliveryType: 'print',
						redemptionCode: 'ABC123',
					},
				},
			],
		},
		totals: {
			donationTotal: 5,
			itemTotal: 30,
			redemptionCodeAppliedTotal: 0,
			freeTrialAppliedTotal: 0,
			bonusAppliedTotal: 0,
			depositTotals: {
				kivaCreditAdded: 0,
				kivaCreditUsed: 0,
			},
		},
	};

	it('exports a valid Vue component', () => {
		expect(CheckoutReceipt).toBeDefined();
		expect(CheckoutReceipt.name).toBe('CheckoutReceipt');
	});

	it('requires lender prop', () => {
		expect(CheckoutReceipt.props.lender.required).toBe(true);
	});

	it('requires receipt prop', () => {
		expect(CheckoutReceipt.props.receipt.required).toBe(true);
	});

	it('has disableRedirects prop with default false', () => {
		expect(CheckoutReceipt.props.disableRedirects.default).toBe(false);
	});

	it('has enableKivaCardTracking prop with default false', () => {
		expect(CheckoutReceipt.props.enableKivaCardTracking.default).toBe(false);
	});

	it('renders checkout receipt container', () => {
		const { container } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const receipt = container.querySelector('.checkout-receipt');
		expect(receipt).toBeTruthy();
	});

	it('renders Order Confirmation headline', () => {
		const { getByText } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		expect(getByText('Order Confirmation')).toBeTruthy();
	});

	it('renders lender information', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const lenderInfo = getByTestId('lender-info');
		expect(lenderInfo.textContent).toContain('John Doe');
		expect(lenderInfo.textContent).toContain('john@example.com');
	});

	it('renders loan items', () => {
		const { getAllByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const loanItems = getAllByTestId('receipt-item-loan');
		expect(loanItems.length).toBe(1);
	});

	it('renders loan name', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const loanName = getByTestId('loan-name');
		expect(loanName.textContent).toContain('Maria');
	});

	it('renders loan country', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const loanCountry = getByTestId('loan-country');
		expect(loanCountry.textContent).toContain('Lima');
		expect(loanCountry.textContent).toContain('Peru');
	});

	it('renders loan use', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const loanUse = getByTestId('loan-use');
		expect(loanUse.textContent).toContain('buy supplies for her store');
	});

	it('renders loan amount', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const loanAmount = getByTestId('loan-amount');
		expect(loanAmount.textContent).toContain('$25');
	});

	it('renders Kiva Cards when provided', () => {
		const { getAllByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const cardItems = getAllByTestId('receipt-item-kcard');
		expect(cardItems.length).toBe(1);
	});

	it('renders print Kiva Card type', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const cardType = getByTestId('kcard-type-print');
		expect(cardType.textContent).toContain('Print-it-yourself Kiva Card');
	});

	it('renders print Kiva Card button', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const printButton = getByTestId('kcard-print-button');
		expect(printButton).toBeTruthy();
		expect(printButton.textContent).toContain('Print Kiva Card');
	});

	it('renders Kiva Card amount', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const cardAmount = getByTestId('kcard-amount');
		expect(cardAmount.textContent).toContain('$25');
	});

	it('renders donation section', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const donation = getByTestId('donation');
		expect(donation).toBeTruthy();
		expect(donation.textContent).toContain('Donation to Kiva');
	});

	it('renders donation amount', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const donationAmount = getByTestId('donation-amount');
		expect(donationAmount.textContent).toContain('$5');
	});

	it('renders receipt total', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const total = getByTestId('receipt-total');
		expect(total).toBeTruthy();
		expect(total.textContent).toContain('Total:');
	});

	it('renders total amount', () => {
		const { getByTestId } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const totalAmount = getByTestId('total-amount');
		expect(totalAmount.textContent).toBe('$30');
	});

	it('has formattedTransactionTime computed property', () => {
		expect(CheckoutReceipt.computed.formattedTransactionTime).toBeDefined();
	});

	it('has loans computed property', () => {
		expect(CheckoutReceipt.computed.loans).toBeDefined();
	});

	it('has kivaCards computed property', () => {
		expect(CheckoutReceipt.computed.kivaCards).toBeDefined();
	});

	it('has printableKivaCards computed property', () => {
		expect(CheckoutReceipt.computed.printableKivaCards).toBeDefined();
	});

	it('has printKivaCard method', () => {
		expect(CheckoutReceipt.methods.printKivaCard).toBeDefined();
	});

	it('has printDonationInformation method', () => {
		expect(CheckoutReceipt.methods.printDonationInformation).toBeDefined();
	});

	it('has printReceipt method', () => {
		expect(CheckoutReceipt.methods.printReceipt).toBeDefined();
	});

	it('applies tw-bg-primary class to wrapper', () => {
		const { container } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const wrapper = container.querySelector('.tw-bg-primary');
		expect(wrapper).toBeTruthy();
	});

	it('applies tw-rounded-xs class to wrapper', () => {
		const { container } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const wrapper = container.querySelector('.tw-rounded-xs');
		expect(wrapper).toBeTruthy();
	});

	it('applies data-hj-suppress class to sensitive info', () => {
		const { container } = render(CheckoutReceipt, {
			props: {
				lender: mockLender,
				receipt: mockReceipt,
			},
			global,
		});

		const sensitiveElements = container.querySelectorAll('.data-hj-suppress');
		expect(sensitiveElements.length).toBeGreaterThan(0);
	});
});
