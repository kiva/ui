import DepositIncentiveUpsell from '#src/components/Checkout/DepositIncentiveUpsell.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import { mockLoansArray } from '../utils';

const mockLoans = mockLoansArray(4);

mockLoans[0].image.url = 'https://www-dev-kiva-org.freetls.fastly.net/img/w150h138/9673d0722a7675b9b8d11f90849d9b44.jpg';
mockLoans[0].image.retinaUrl = 'https://www-dev-kiva-org.freetls.fastly.net/img/w300h276/9673d0722a7675b9b8d11f90849d9b44.jpg';
mockLoans[0].image.lgUrl = 'https://www-dev-kiva-org.freetls.fastly.net/img/w244h185/9673d0722a7675b9b8d11f90849d9b44.jpg';
mockLoans[0].image.lgRetinaUrl = 'https://www-dev-kiva-org.freetls.fastly.net/img/w488h370/9673d0722a7675b9b8d11f90849d9b44.jpg';

const queryResult = {
	data: {
		fundraisingLoans: {
			values: mockLoans,
		},
	},
};

export default {
	title: 'Components/Checkout/DepositIncentiveUpsell',
	component: DepositIncentiveUpsell,
	args: {
		goal: 50,
		progress: 25,
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { DepositIncentiveUpsell },
	mixins: [apolloStoryMixin({ queryResult })],
	template: '<deposit-incentive-upsell :goal="goal" :progress="progress" />',
});
