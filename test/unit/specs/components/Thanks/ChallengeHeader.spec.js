import ChallengeHeader from '../../../../../src/components/Thanks/ChallengeHeader';
import { render } from '@testing-library/vue';
import { globalOptions } from '../../../specUtils';

describe('ChallengeHeader', () => {
	it('should contain these components and text', () => {
		const goal = {
			targets: {
				totalCount: 2,
				values: [
					{
						loanId: 1,
						status: 'IN_PROGRESS',
					},
					{
						loanId: 2,
						status: 'COMPLETE',
					},
				],
			},
			endDate: '2024-02-01T07:59:00.000Z',
		};

		const {
			getByText,
			getByTestId,
		} = render(ChallengeHeader, {
			global: {
				...globalOptions,
			},
			props: {
				teamPublicId: '1',
				goal,
			},
		});

		getByTestId('challenge-header');

		const LoansFunded = getByText('1/2 loans funded');
		expect(getByTestId('loans-funded')).toBe(LoansFunded);

		const PercentageFunded = getByText('0% complete');
		expect(getByTestId('percentage-funded')).toBe(PercentageFunded);
	});
});
