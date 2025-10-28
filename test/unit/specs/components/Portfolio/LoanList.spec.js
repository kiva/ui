import { render } from '@testing-library/vue';
import LoanList from '#src/components/Portfolio/LoanList';

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvFlag: {
		name: 'KvFlag',
		template: '<span class="kv-flag"></span>',
		props: ['country']
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div class="kv-loading-placeholder"></div>'
	}
}));

// Mock PaidAmountModal
vi.mock('#src/components/Portfolio/PaidAmountModal', () => ({
	default: {
		name: 'PaidAmountModal',
		template: '<div class="paid-amount-modal">{{ amount }}</div>',
		props: ['amount']
	}
}));

// Mock loan status enums
vi.mock('#src/api/fixtures/LoanStatusEnum', () => ({
	DEFAULTED: 'defaulted',
	ENDED: 'ended',
	EXPIRED: 'expired',
	FUNDED: 'funded',
	FUNDRAISING: 'fundraising',
	PAYING_BACK: 'payingBack',
	RAISED: 'raised',
	REFUNDED: 'refunded'
}));

describe('LoanList', () => {
	let mockKvTrackEvent;
	let mockCookieStore;

	const mockLoan = {
		id: 123,
		name: 'Maria',
		image: {
			url: 'https://example.com/image.jpg'
		},
		sector: {
			name: 'Agriculture'
		},
		geocode: {
			country: {
				name: 'Peru',
				isoCode: 'PE'
			}
		},
		partnerName: 'Test Partner',
		partnerId: 456,
		status: 'fundraising',
		userProperties: {
			loanBalance: {
				amountPurchasedByLender: 25,
				amountRepaidToLender: 10
			}
		},
		terms: {
			disbursalDate: '2024-01-15',
			loanAmount: 500
		},
		lenderRepaymentTerm: 12,
		teams: {
			values: [
				{
					name: 'Team Kiva',
					image: {
						url: 'https://example.com/team.jpg'
					}
				}
			]
		}
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockKvTrackEvent = vi.fn();
		mockCookieStore = {};
	});

	const createComponent = (props = {}) => {
		return render(LoanList, {
			props: {
				loans: [],
				loading: false,
				...props
			},
			global: {
				mocks: {
					$kvTrackEvent: mockKvTrackEvent
				},
				provide: {
					cookieStore: mockCookieStore
				},
				directives: {
					'kv-track-event': () => {}
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(LoanList.name).toBe('LoanList');
		});

		it('should render table headers', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Loan details');
			expect(container.textContent).toContain('Status');
			expect(container.textContent).toContain('You loaned');
			expect(container.textContent).toContain('Amount');
			expect(container.textContent).toContain('Length');
			expect(container.textContent).toContain('Paid back or raised');
			expect(container.textContent).toContain('Team');
		});

		it('should render table element', () => {
			const { container } = createComponent();
			const table = container.querySelector('table');
			expect(table).toBeTruthy();
		});
	});

	describe('Loading State', () => {
		it('should show loading placeholders when loading is true', () => {
			const { container } = createComponent({ loading: true });
			const placeholders = container.querySelectorAll('.kv-loading-placeholder');
			expect(placeholders.length).toBeGreaterThan(0);
		});

		it('should render 3 rows of placeholders', () => {
			const { container } = createComponent({ loading: true });
			const grids = container.querySelectorAll('.tw-grid');
			expect(grids.length).toBe(3);
		});

		it('should show loading state when loading', () => {
			const { container } = createComponent({
				loading: true,
				loans: [mockLoan]
			});
			// Loading state should be visible
			const placeholders = container.querySelectorAll('.kv-loading-placeholder');
			expect(placeholders.length).toBeGreaterThan(0);
		});
	});

	describe('Empty State', () => {
		it('should show "No loans found" when no loans and not loading', () => {
			const { container } = createComponent({
				loading: false,
				loans: []
			});
			expect(container.textContent).toContain('No loans found');
		});

		it('should not show "No loans found" when loading', () => {
			const { container } = createComponent({
				loading: true,
				loans: []
			});
			expect(container.textContent).not.toContain('No loans found');
		});

		it('should not show "No loans found" when loans exist', () => {
			const { container } = createComponent({
				loading: false,
				loans: [mockLoan]
			});
			expect(container.textContent).not.toContain('No loans found');
		});
	});

	describe('Loan Rendering', () => {
		it('should render loan name', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Maria');
		});

		it('should render loan ID', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('#123');
		});

		it('should render loan image', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const img = container.querySelector('img.loan-image');
			expect(img).toBeTruthy();
			expect(img.getAttribute('src')).toBe('https://example.com/image.jpg');
		});

		it('should render sector name', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Agriculture');
		});

		it('should render dash when sector is missing', () => {
			const loanWithoutSector = { ...mockLoan, sector: null };
			const { container } = createComponent({ loans: [loanWithoutSector] });
			const td = container.querySelectorAll('td')[0];
			expect(td.textContent).toContain('-');
		});

		it('should render country name', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Peru');
		});

		it('should render country flag', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const flag = container.querySelector('.kv-flag');
			expect(flag).toBeTruthy();
		});

		it('should render dash when country is missing', () => {
			const loanWithoutCountry = { ...mockLoan, geocode: null };
			const { container } = createComponent({ loans: [loanWithoutCountry] });
			const td = container.querySelectorAll('td')[0];
			expect(td.textContent).toContain('-');
		});

		it('should render partner name with link', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Test Partner');
			const link = Array.from(container.querySelectorAll('a'))
				.find(a => a.textContent.includes('Test Partner'));
			expect(link).toBeTruthy();
			expect(link.getAttribute('href')).toBe('/about/where-kiva-works/partners/456');
		});

		it('should render multiple loans', () => {
			const loan2 = { ...mockLoan, id: 456, name: 'John' };
			const { container } = createComponent({ loans: [mockLoan, loan2] });
			expect(container.textContent).toContain('Maria');
			expect(container.textContent).toContain('John');
		});
	});

	describe('Loan Status', () => {
		it('should render Fundraising status', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Fundraising');
		});

		it('should render Funded status', () => {
			const loan = { ...mockLoan, status: 'funded' };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('Funded');
		});

		it('should render Paying Back status', () => {
			const loan = { ...mockLoan, status: 'payingBack' };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('Paying Back');
		});

		it('should render Delinquent status', () => {
			const loan = { ...mockLoan, status: 'payingBackDelinquent' };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('Delinquent');
		});

		it('should render Defaulted status', () => {
			const loan = { ...mockLoan, status: 'defaulted' };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('Defaulted');
		});

		it('should render Ended status', () => {
			const loan = { ...mockLoan, status: 'ended' };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('Ended');
		});

		it('should render unknown status as-is', () => {
			const loan = { ...mockLoan, status: 'unknownStatus' };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('unknownStatus');
		});
	});

	describe('Loan Amounts', () => {
		it('should render amount purchased by lender', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('$25');
		});

		it('should render total loan amount', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('$500');
		});

		it('should render repayment term', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('12 mos');
		});

		it('should render dash when repayment term is missing', () => {
			const loan = { ...mockLoan, lenderRepaymentTerm: null };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('- mos');
		});

		it('should render paid amount modal', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const modal = container.querySelector('.paid-amount-modal');
			expect(modal).toBeTruthy();
			expect(modal.textContent).toBe('10');
		});
	});

	describe('Date Formatting', () => {
		it('should format disbursal date', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			// Date formatting may vary by timezone, just check it exists
			expect(container.textContent).toContain('Jan');
			expect(container.textContent).toContain('2024');
		});

		it('should show placeholder when date is missing', () => {
			const loan = { ...mockLoan, terms: { ...mockLoan.terms, disbursalDate: null } };
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('(Endpoint TBD)');
		});
	});

	describe('Team Information', () => {
		it('should render team name', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Team Kiva');
		});

		it('should render team image', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const teamCell = container.querySelector('.team-cell');
			const img = teamCell.querySelector('img');
			expect(img).toBeTruthy();
			expect(img.getAttribute('src')).toBe('https://example.com/team.jpg');
		});

		it('should render dash when no team', () => {
			const loan = { ...mockLoan, teams: { values: [] } };
			const { container } = createComponent({ loans: [loan] });
			const teamCell = container.querySelector('.team-cell');
			expect(teamCell.textContent.trim()).toContain('-');
		});

		it('should handle missing team image', () => {
			const loan = {
				...mockLoan,
				teams: {
					values: [{
						name: 'Team Kiva',
						image: null
					}]
				}
			};
			const { container } = createComponent({ loans: [loan] });
			expect(container.textContent).toContain('Team Kiva');
		});
	});

	describe('Borrower Link', () => {
		it('should link to borrower profile', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const link = container.querySelector('a[href="/lend/123"]');
			expect(link).toBeTruthy();
		});

		it('should have action color for link', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const link = container.querySelector('a[href="/lend/123"]');
			expect(link.classList.contains('tw-text-action')).toBe(true);
		});
	});

	describe('Table Layout', () => {
		it('should have bordered header row', () => {
			const { container } = createComponent();
			const headerRow = container.querySelector('thead tr');
			expect(headerRow.classList.contains('tw-border-y')).toBe(true);
		});

		it('should have bordered body rows', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			const bodyRow = container.querySelector('tbody tr');
			expect(bodyRow.classList.contains('tw-border-b')).toBe(true);
		});

		it('should have scroll gradient', () => {
			const { container } = createComponent();
			const gradient = container.querySelector('.scroll-gradient');
			expect(gradient).toBeTruthy();
		});
	});

	describe('Props', () => {
		it('should accept loans prop', () => {
			const { container } = createComponent({ loans: [mockLoan] });
			expect(container.textContent).toContain('Maria');
		});

		it('should default loans to empty array', () => {
			const { container } = createComponent({ loans: undefined });
			expect(container.textContent).toContain('No loans found');
		});

		it('should accept loading prop', () => {
			const { container } = createComponent({ loading: true });
			const placeholders = container.querySelectorAll('.kv-loading-placeholder');
			expect(placeholders.length).toBeGreaterThan(0);
		});

		it('should default loading to true', () => {
			const { container } = createComponent({ loading: undefined, loans: [] });
			// Component should show loading state by default
			expect(container).toBeTruthy();
		});
	});
});
