import ChallengeHeader from '@/components/Thanks/ChallengeHeader';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import { render } from '@testing-library/vue';
import KvProgressCircle from '@/components/Kv/KvProgressCircle';

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
		} = render(
			ChallengeHeader,
			{
				components: KvProgressCircle,
				provide: {
					apollo: {
					},
				},
				props: {
					email: 'test@test.com',
					teamPublicId: '1',
					goal,
				},
			},
			vue => {
				vue.use(kvAnalytics);
			}
		);

		getByTestId('challenge-header');

		const LoansFunded = getByText('1/2 loans funded');
		expect(getByTestId('loans-funded')).toBe(LoansFunded);

		const PercentageFunded = getByText('0% complete');
		expect(getByTestId('percentage-funded')).toBe(PercentageFunded);
	});
});
