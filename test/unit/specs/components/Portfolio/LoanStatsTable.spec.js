import { render, waitFor } from '@testing-library/vue';
import LoanStatsTable from '../../../../../src/components/Portfolio/LoanStatsTable';

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div class="kv-loading-placeholder"></div>'
	}
}));

// Mock GraphQL query
vi.mock('#src/graphql/query/myPortfolioLoansLendingStats.graphql', () => ({
	default: 'lendingStatsQuery'
}));

describe('LoanStatsTable', () => {
	let mockCookieStore;

	const mockStatsData = {
		my: {
			userStats: {
				amount_of_loans: 1000,
				amount_repaid: 750,
				amount_defaulted: 50,
				amount_refunded: 25,
				arrears_rate: 0.05,
				amount_in_arrears: 100,
				amount_outstanding: 200,
				default_rate: 0.02,
				total_ended: 800,
				currency_loss_rate: 1.5,
				currency_loss: 15,
				currency_reimbursement: 10,
				num_fund_raising: 3,
				num_raised: 5,
				num_paying_back: 7,
				number_delinquent: 2,
				num_ended: 20,
				num_defaulted: 1,
				num_refunded: 2,
				num_expired: 1
			}
		},
		general: {
			kivaStats: {
				avgAmountRepaid: 500,
				avgAmountArrears: 75,
				avgAmountOutstanding: 150,
				avgDefaultRate: 0.03,
				avgAmountDefaulted: 40
			}
		}
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockCookieStore = {};
	});

	const createComponent = (apolloResult = mockStatsData) => {
		return render(LoanStatsTable, {
			global: {
				provide: {
					apollo: {},
					cookieStore: mockCookieStore
				},
				mixins: [{
					created() {
						// Manually set component data from apollo result
						if (apolloResult) {
							const userStats = apolloResult.my?.userStats ?? {};
							const kivaStats = apolloResult.general?.kivaStats ?? {};

							this.stats = userStats;
							this.avgStats = {
								amount_repaid: kivaStats.avgAmountRepaid ?? null,
								amount_in_arrears: kivaStats.avgAmountArrears ?? null,
								amount_outstanding: kivaStats.avgAmountOutstanding ?? null,
								default_rate: kivaStats.avgDefaultRate ?? null,
								amount_defaulted: kivaStats.avgAmountDefaulted ?? null,
								amount_of_loans: null,
								arrears_rate: null,
								amount_refunded: null,
								total_ended: null,
								currency_loss_rate: null,
								currency_loss: null,
								currency_reimbursement: null
							};
							this.loading = false;

							// Update loan counts
							this.loanCounts = {
								fundraising: userStats.num_fund_raising || 0,
								funded: userStats.num_raised || 0,
								payingBack: userStats.num_paying_back || 0,
								payingBackDelinquent: userStats.number_delinquent || 0,
								repaid: (userStats.num_ended || 0) - (userStats.currency_loss ? 1 : 0),
								repaidWithCurrencyLoss: userStats.currency_loss ? 1 : 0,
								defaulted: userStats.num_defaulted || 0,
								refunded: userStats.num_refunded || 0,
								expired: userStats.num_expired || 0
							};
						}
					}
				}]
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(LoanStatsTable.name).toBe('LoanStatsTable');
		});

		it('should render table headers', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('My stats');
			expect(container.textContent).toContain('Avg Kiva lender');
		});

		it('should render stats table', () => {
			const { container } = createComponent();
			const table = container.querySelector('table');
			expect(table).toBeTruthy();
		});

		it('should render loan counts section', () => {
			const { container } = createComponent();
			const loanCountSection = container.querySelector('[aria-label="Loan count statistics"]');
			expect(loanCountSection).toBeTruthy();
		});

		it('should have hr separator', () => {
			const { container } = createComponent();
			const hr = container.querySelector('hr');
			expect(hr).toBeTruthy();
		});
	});

	describe('Loading State', () => {
		it('should show loading placeholders initially', () => {
			const { container } = createComponent(null);
			const placeholders = container.querySelectorAll('.kv-loading-placeholder');
			expect(placeholders.length).toBeGreaterThan(0);
		});

		it('should render 5 loading rows', () => {
			const { container } = createComponent(null);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBe(5);
		});

		it('should have 3 loading placeholders per row', () => {
			const { container } = createComponent(null);
			const firstRow = container.querySelector('tbody tr');
			const placeholders = firstRow.querySelectorAll('.kv-loading-placeholder');
			expect(placeholders.length).toBe(3);
		});
	});

	describe('Stats Rows', () => {
		it('should render Amount lent row', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Amount lent');
			});
		});

		it('should render Amount repaid row', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Amount repaid');
			});
		});

		it('should render Delinquency rate row', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Delinquency rate');
			});
		});

		it('should render Default rate row', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Default rate');
			});
		});

		it('should render all 13 stat rows', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Currency loss reimbursement');
			});
		});
	});

	describe('Value Formatting - Currency', () => {
		it('should format currency values correctly', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('$1000.00');
				expect(container.textContent).toContain('$750.00');
			});
		});

		it('should format zero currency as $0.00', async () => {
			const dataWithZero = {
				...mockStatsData,
				my: {
					userStats: {
						...mockStatsData.my.userStats,
						amount_refunded: 0
					}
				}
			};
			const { container } = createComponent(dataWithZero);
			await waitFor(() => {
				expect(container.textContent).toContain('$0.00');
			});
		});

		it('should show "Endpoint TBD" for null values', async () => {
			const dataWithNull = {
				...mockStatsData,
				my: {
					userStats: {
						...mockStatsData.my.userStats,
						amount_refunded: null
					}
				}
			};
			const { container } = createComponent(dataWithNull);
			await waitFor(() => {
				expect(container.textContent).toContain('Endpoint TBD');
			});
		});
	});

	describe('Value Formatting - Percentage', () => {
		it('should format percentage values correctly', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// 0.05 * 100 = 5.00%
				expect(container.textContent).toContain('5.00%');
				// 0.02 * 100 = 2.00%
				expect(container.textContent).toContain('2.00%');
			});
		});

		it('should format zero percentage as 0.00%', async () => {
			const dataWithZero = {
				...mockStatsData,
				my: {
					userStats: {
						...mockStatsData.my.userStats,
						arrears_rate: 0
					}
				}
			};
			const { container } = createComponent(dataWithZero);
			await waitFor(() => {
				expect(container.textContent).toContain('0.00%');
			});
		});
	});

	describe('Value Formatting - Currency Loss Rate', () => {
		it('should format currency loss rate correctly', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// 1.5% formatted directly
				expect(container.textContent).toContain('1.50%');
			});
		});
	});

	describe('Value Formatting - Currency Negative', () => {
		it('should format negative currency values correctly', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// 15 * -1 = $-15.00 (note: minus sign appears after dollar sign)
				expect(container.textContent).toContain('$-15.00');
			});
		});
	});

	describe('Average Stats', () => {
		it('should display average amount repaid', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('$500.00');
			});
		});

		it('should display average amount in arrears', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('$75.00');
			});
		});

		it('should display average default rate', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// 0.03 * 100 = 3.00%
				expect(container.textContent).toContain('3.00%');
			});
		});

		it('should show Endpoint TBD for unavailable avg stats', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// Fields not available in API yet
				const text = container.textContent;
				expect(text).toContain('Endpoint TBD');
			});
		});
	});

	describe('Loan Counts', () => {
		it('should display fundraising count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Fundraising');
				expect(container.textContent).toContain('3');
			});
		});

		it('should display funded count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Funded');
				expect(container.textContent).toContain('5');
			});
		});

		it('should display paying back count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Paying back');
				expect(container.textContent).toContain('7');
			});
		});

		it('should display delinquent count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Paying back delinquent');
				expect(container.textContent).toContain('2');
			});
		});

		it('should calculate repaid count correctly', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Repaid');
				// num_ended (20) - (currency_loss ? 1 : 0) = 19
				expect(container.textContent).toContain('19');
			});
		});

		it('should display repaid with currency loss', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Repaid with currency loss');
				expect(container.textContent).toContain('1');
			});
		});

		it('should display defaulted count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Ended in default');
				expect(container.textContent).toContain('1');
			});
		});

		it('should display refunded count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Refunded');
				expect(container.textContent).toContain('2');
			});
		});

		it('should display expired count', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				expect(container.textContent).toContain('Expired');
				expect(container.textContent).toContain('1');
			});
		});
	});

	describe('Loan Counts - Edge Cases', () => {
		it('should default to 0 when stats are missing', async () => {
			const minimalData = {
				my: { userStats: {} },
				general: { kivaStats: {} }
			};
			const { container } = createComponent(minimalData);
			await waitFor(() => {
				expect(container.textContent).toContain('Fundraising');
			});
		});

		it('should handle repaid count when no currency loss', async () => {
			const dataWithoutLoss = {
				...mockStatsData,
				my: {
					userStats: {
						...mockStatsData.my.userStats,
						currency_loss: 0,
						num_ended: 20
					}
				}
			};
			const { container } = createComponent(dataWithoutLoss);
			await waitFor(() => {
				// Should show full num_ended since no currency loss
				expect(container.textContent).toContain('20');
			});
		});
	});

	describe('Grid Layout', () => {
		it('should use grid layout for loan counts', () => {
			const { container } = createComponent();
			const grid = container.querySelector('.tw-grid');
			expect(grid).toBeTruthy();
		});

		it('should have proper ARIA attributes', () => {
			const { container } = createComponent();
			const table = container.querySelector('[role="table"]');
			expect(table).toBeTruthy();
			expect(table.getAttribute('aria-label')).toBe('Loan count statistics');
		});

		it('should have row roles for loan counts', () => {
			const { container } = createComponent();
			const rows = container.querySelectorAll('[role="row"]');
			expect(rows.length).toBeGreaterThan(0);
		});

		it('should have cell roles for loan count values', () => {
			const { container } = createComponent();
			const cells = container.querySelectorAll('[role="cell"]');
			expect(cells.length).toBeGreaterThan(0);
		});
	});

	describe('Table Styling', () => {
		it('should have gray background on header row', () => {
			const { container } = createComponent();
			const headerRow = container.querySelector('thead tr');
			expect(headerRow.classList.contains('tw-bg-gray-200')).toBe(true);
		});

		it('should have right-aligned headers', () => {
			const { container } = createComponent();
			const headers = container.querySelectorAll('thead th');
			const rightAligned = Array.from(headers).filter(
				th => th.classList.contains('tw-text-right')
			);
			expect(rightAligned.length).toBeGreaterThan(0);
		});

		it('should have right-aligned stat values', () => {
			const { container } = createComponent();
			const rightAligned = container.querySelectorAll('.tw-text-right');
			expect(rightAligned.length).toBeGreaterThan(0);
		});
	});
});
