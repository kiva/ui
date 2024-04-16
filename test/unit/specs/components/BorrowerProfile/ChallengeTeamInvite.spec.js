import { render } from '@testing-library/vue';
import ChallengeTeamInvite from '@/components/BorrowerProfile/ChallengeTeamInvite';

const shareLender = { id: 1, name: 'Lender' };
const teamName = 'Team Test';
const mocks = {
	$route: {
		query: {
			team: teamName
		}
	}
};

describe('ChallengeCallout', () => {
	it('should display team name', () => {
		const { getByText } = render(ChallengeTeamInvite, {
			props: { shareLender, teamName },
			mocks,
		});

		getByText(teamName);
	});

	it('should display lender image', () => {
		const { getByAltText } = render(ChallengeTeamInvite, {
			props: {
				shareLender: {
					...shareLender,
					image: {
						url: 'test.jpg',
					},
				},
				teamName
			},
			mocks,
		});

		getByAltText('Image of lender');
	});
});
