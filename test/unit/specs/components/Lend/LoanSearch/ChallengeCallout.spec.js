import { render } from '@testing-library/vue';
import ChallengeCallout from '../../../../../../src/components/Lend/LoanSearch/ChallengeCallout';
import { globalOptions } from '../../../../specUtils';

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
		const show = vi.fn();

		const { getByAltText, getByText } = render(ChallengeCallout, {
			global: {
				...globalOptions,
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
				mocks,
			},
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

		});

		getByAltText('Image of lender');
		getByText('Added to cart!');
		expect(show).toHaveBeenCalled();
	});
});
