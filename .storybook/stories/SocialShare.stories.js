import SocialShare from '@/components/Checkout/SocialShare';
import StoryRouter from 'storybook-vue-router';
import mockedReceiptData from '../mock-data/receipt-data-mock';

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
				return {
					...mockedReceiptData.data.my.userAccount,
					teams: mockedReceiptData.data.my.teams.values.map(value => value.team)
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
