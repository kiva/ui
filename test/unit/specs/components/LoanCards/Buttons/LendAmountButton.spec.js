import { render } from '@testing-library/vue';
import LendAmountButton from '../../../../../../src/components/LoanCards/Buttons/LendAmountButton';
import { globalOptions } from '../../../../specUtils';

describe('LendAmountButton', () => {
	it('should display amount with a number input', async () => {
		const { getByText } = render(LendAmountButton, {
			global: {
				...globalOptions,
			},
			props: { amountLeft: 20.00 },
		});

		// Expect the button to exist and have correct amount
		const buttonElement = getByText('Lend $20');
		expect(buttonElement).toBeDefined();
	});

	it('should display amount with a string input', async () => {
		const { getByText } = render(
			LendAmountButton,
			{
				global: {
					...globalOptions,
				},
				props: { amountLeft: '20.00' },
			}
		);

		// Expect the button to exist and have correct amount
		const buttonElement = getByText('Lend $20');
		expect(buttonElement).toBeDefined();
	});
});
