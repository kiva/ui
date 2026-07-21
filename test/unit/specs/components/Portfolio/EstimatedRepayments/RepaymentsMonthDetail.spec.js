import { render } from '@testing-library/vue';
import numeral from 'numeral';
import RepaymentsMonthDetail from '#src/components/Portfolio/EstimatedRepayments/RepaymentsMonthDetail';

const renderDetail = (props = {}) => render(RepaymentsMonthDetail, {
	props: {
		heading: 'July 1, 2026',
		loading: false,
		rows: [],
		truncated: false,
		...props,
	},
	global: {
		directives: { 'kv-track-event': {} },
		mocks: { $filters: { numeral: (value, format) => numeral(value).format(format) } },
		stubs: { KvLoadingPlaceholder: { template: '<div data-testid="loading" />' } },
	},
});

const row = overrides => ({
	amount: 50,
	userAmount: 40,
	promoAmount: 0,
	promoType: null,
	isDelinquent: false,
	pastRepayments: 3,
	totalRepayments: 8,
	loan: { id: '1', name: 'Maria' },
	...overrides,
});

describe('RepaymentsMonthDetail', () => {
	it('shows the loading placeholder when loading', () => {
		const { getByTestId } = renderDetail({ loading: true });
		expect(getByTestId('detail-loading')).toBeTruthy();
	});

	it('shows the empty message when there are no rows', () => {
		const { getByTestId } = renderDetail();
		expect(getByTestId('detail-empty')).toBeTruthy();
	});

	it('maps the raw promoType enum to its human-readable label (legacy parity)', () => {
		const { getByText } = renderDetail({
			rows: [row({ promoAmount: 10, promoType: 'reward_credit' })],
		});
		expect(getByText(/Includes \$10\.00 of bonus credit \(repaid to Kiva or sponsor\)/)).toBeTruthy();
	});

	it('maps the free_trial promoType to "free trial credit"', () => {
		const { getByText } = renderDetail({
			rows: [row({ promoAmount: 7.5, promoType: 'free_trial' })],
		});
		expect(getByText(/Includes \$7\.50 of free trial credit \(repaid to Kiva or sponsor\)/)).toBeTruthy();
	});

	it('falls back to a generic promo label for an unknown or missing promoType', () => {
		const { getByText } = renderDetail({
			rows: [row({ promoAmount: 5, promoType: 'something_new' })],
		});
		expect(getByText(/of promotional credit/)).toBeTruthy();
	});

	it('flags delinquent and final repayments', () => {
		const { getByText } = renderDetail({
			rows: [row({ isDelinquent: true, pastRepayments: 8, totalRepayments: 8 })],
		});
		expect(getByText('Delinquent')).toBeTruthy();
		expect(getByText('Final')).toBeTruthy();
	});

	it('links the borrower to the loan page', () => {
		const { getByText } = renderDetail({ rows: [row()] });
		expect(getByText('Maria').getAttribute('href')).toBe('/lend/1');
	});

	it('shows the truncation notice when truncated', () => {
		const { getByTestId } = renderDetail({ rows: [row()], truncated: true });
		expect(getByTestId('detail-truncated')).toBeTruthy();
	});
});
