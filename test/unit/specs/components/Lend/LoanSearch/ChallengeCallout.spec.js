import Vue from 'vue';
import { render } from '@testing-library/vue';
import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';

const shareLender = { id: 1, name: 'Lender' };
const teamName = 'Team Test';

describe('ChallengeCallout', () => {
	it('should display share lender in message', () => {
		const { getByText } = render(ChallengeCallout, {
			props: { shareLender, teamName }
		});

		getByText(`Support ${shareLender.name} and help ${teamName} hit their goal`);
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
			}
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
			}
		});

		getByAltText('Lender photo');
		getByText('Added to cart!');
	});
});
