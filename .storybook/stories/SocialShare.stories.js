import { mockedReceiptData } from './CheckoutReceipt.stories';
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
			:loans="loans"
			:user-teams="userTeams"
		/>
	`,
	props: {
		loans: {
			type: Array,
			default() {
				return mockedReceiptData.data.shop.receipt.items.values
					.filter(item => item.basketItemType === 'loan_reservation')
					.map(item => item.loan);
			}
		},
		userTeams: {
			type: Array,
			default() {
				return mockedReceiptData.data.my.teams.values;
			}
		},
	},
});
