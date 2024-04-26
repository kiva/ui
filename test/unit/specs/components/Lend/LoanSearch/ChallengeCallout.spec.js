import Vue from 'vue';
import { render } from '@testing-library/vue';
import ChallengeCallout from '@/components/Lend/LoanSearch/ChallengeCallout';

const teamName = 'Team Test';
const mocks = {
	$route: {
		query: {
			team: teamName
		}
	}
};

describe('ChallengeCallout', () => {
	it('should display add to cart message', () => {
		Vue.directive('kv-track-event', () => ({}));

		const show = jest.fn();

		const { getByAltText, getByText } = render(ChallengeCallout, {
			props: {
				currentLender: {
					lender: {
						image: {
							url: 'test.jpg',
						},
					},
				},
				showAddedToCartMessage: true,
				borrowerName: 'Borrower',
			},
			mocks,
			stubs: {
				KvToast: {
					template: `
						<div ref="toastRef">
							<img src="test.jpg" alt="Image of lender" />
							<span class="tw-whitespace-nowrap">Added to cart!</span>
						</div>
					`,
					methods: {
						close: () => ({}),
						show,
					},
				},
			},
		});

		getByAltText('Image of lender');
		getByText('Added to cart!');
		expect(show).toHaveBeenCalled();
	});
});
