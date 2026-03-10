import { render } from '@testing-library/vue';
import MyKivaImpactInsightScreen1 from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightScreen1';
import { globalOptions } from '../../../specUtils';

const global = {
	...globalOptions,
	mocks: { ...globalOptions.mocks, $appConfig: { photoPath: '' } },
};

const baseLoan = {
	id: 1,
	name: 'María',
	image: { id: 1, hash: 'abc123' },
	geocode: {
		country: {
			id: 1,
			name: 'Colombia',
			isoCode: 'CO',
			ppp: 8249,
			geocode: { latitude: 4.57, longitude: -74.29 },
		},
	},
};

describe('MyKivaImpactInsightScreen1', () => {
	it('shows the transaction amount for a single loan purchase', () => {
		const { getByText } = render(MyKivaImpactInsightScreen1, {
			global,
			props: { latestLoan: { ...baseLoan, amount: -25 } },
		});
		getByText(/Your \$25 loan helps/);
	});

	it('shows totalAmountPurchased when lending credit was applied', () => {
		// MyKivaPage sets totalAmountPurchased from loanBalance (lender + lending credit)
		// Screen1 prefers it over the transaction amount
		const { getByText } = render(MyKivaImpactInsightScreen1, {
			global,
			props: { latestLoan: { ...baseLoan, amount: -20, totalAmountPurchased: '25.00' } },
		});
		getByText(/Your \$25 loan helps/);
	});

	it('shows the borrower name and country', () => {
		const { getByText } = render(MyKivaImpactInsightScreen1, {
			global,
			props: { latestLoan: { ...baseLoan, amount: -25 } },
		});
		getByText(/helps María build stability and success in/);
		getByText('Colombia');
	});

	it('shows the annual income when ppp is available', () => {
		const { getByText } = render(MyKivaImpactInsightScreen1, {
			global,
			props: { latestLoan: { ...baseLoan, amount: -25 } },
		});
		getByText(/annual income is \$8,249 USD/);
	});

	it('renders nothing for amount when latestLoan is null', () => {
		const { queryByText } = render(MyKivaImpactInsightScreen1, {
			global,
			props: { latestLoan: null },
		});
		expect(queryByText(/Your \$/)).toBeNull();
	});
});
