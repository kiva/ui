import { render } from '@testing-library/vue';
import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';

const lender = { id: 1, name: 'Lender' };
const teamName = 'Team Test';

describe('ChallengeCallout', () => {
	it('should display lender in message', () => {
		const { getByText } = render(ChallengeCallout, {
			props: { lender, teamName }
		});

		getByText(`Support ${lender.name} and help ${teamName} hit their goal`);
	});

	it('should display lender image', () => {
		const { getByAltText } = render(ChallengeCallout, {
			props: {
				lender: {
					...lender,
					image: {
						url: 'test.jpg',
					},
				},
				teamName
			}
		});

		getByAltText(`${lender.name} image`);
	});
});
