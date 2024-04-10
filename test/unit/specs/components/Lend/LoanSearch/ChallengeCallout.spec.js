import Vue from 'vue';
import { render } from '@testing-library/vue';
import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';

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
		const { getByText } = render(ChallengeCallout, {
			props: { shareLender, teamName },
			mocks,
		});

		getByText(teamName);
	});

	it('should display lender image', () => {
		const { getByAltText } = render(ChallengeCallout, {
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

		getByAltText(`${shareLender.name} image`);
	});

	it('should display add to cart message', () => {
		Vue.directive('kv-track-event', () => ({}));

		const { getByAltText, getByText } = render(ChallengeCallout, {
			props: {
				currentLender: {
					lender: {
						image: {
							url: 'test.jpg',
						},
					},
				},
				teamName,
				showAddedToCartMessage: true,
				borrowerName: 'Borrower',
			},
			mocks,
		});

		getByAltText('Image of lender');
		getByText('Added to cart!');
	});
});
