import StoryRouter from 'storybook-vue-router';
import CheckoutReceipt from '@/components/Checkout/CheckoutReceipt';
import mockedReceiptData from '../mock-data/receipt-data-mock';

export default {
	title: 'Components/CheckoutReceipt',
	component: CheckoutReceipt,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		CheckoutReceipt,
	},
	template: `
		<checkout-receipt
			:lender="lender"
			:receipt="receipt"
		/>
	`,
	props: {
		lender: {
			type: Object,
			default() {
				return mockedReceiptData.data.my.userAccount
			}
		},
		receipt: {
			type: Object,
			default() {
				return mockedReceiptData.data.shop.receipt
			}
		}
	},
});
