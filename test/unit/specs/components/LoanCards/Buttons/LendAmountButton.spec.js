import { render } from '@testing-library/vue';
import LendAmountButton from '@/components/LoanCards/Buttons/LendAmountButton';
import kvAnalytics from '@/plugins/kv-analytics-plugin';

describe('LendAmountButton', () => {
	it('should display amount with a number input', async () => {
		const { getByText } = render(LendAmountButton,
			{
				provide: {
					apollo: {
						query: () => Promise.resolve({}),
					},
				},
				props: { amountLeft: 20.00 },
			},
			vue => {
				vue.use(kvAnalytics);
			});

		// Expect the button to exist and have correct amount
		const buttonElement = getByText('Lend $20');
		expect(buttonElement).toBeDefined();
	});

	it('should display amount with a string input', async () => {
		const { getByText } = render(LendAmountButton,
			{
				provide: {
					apollo: {
						query: () => Promise.resolve({}),
					},
				},
				props: { amountLeft: '20.00' },
			},
			vue => {
				vue.use(kvAnalytics);
			});

		// Expect the button to exist and have correct amount
		const buttonElement = getByText('Lend $20');
		expect(buttonElement).toBeDefined();
	});
});
