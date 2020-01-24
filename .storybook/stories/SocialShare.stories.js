import { mockedReceiptData } from './CheckoutReceipt.stories';
import _get from 'lodash/get';
import SocialShare from '@/components/Checkout/SocialShare';
import StoryRouter from 'storybook-vue-router';

export default {
	title: 'Components/SocialShare',
	decorators: [StoryRouter()],
	component: SocialShare,
};

export const Default = () => ({
	components: {
		SocialShare,
	},
	template: `
		<social-share
			:lender="lender"
			:loans="loans"
		/>
	`,
	provide: {
		apollo: {
			mutate() {
				return Promise.resolve();
			},
		},
	},
	props: {
		lender: {
			type: Object,
			default() {
				const teams = _get(mockedReceiptData, 'data.my.teams.values');
				return {
					...mockedReceiptData.data.my.userAccount,
					teams: teams ? teams.map(value => value.team) : []
				};
			}
		},
		loans: {
			type: Array,
			default() {
				return mockedReceiptData.data.shop.receipt.items.values
					.filter(item => item.basketItemType === 'loan_reservation')
					.map(item => item.loan);
			}
		},
	},
});
