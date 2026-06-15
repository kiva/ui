import ShareButton from '#src/components/BorrowerProfile/ShareButton';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import { fundraisingPartnerLoan, createQueryResult, loggedInUser } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/ShareButton',
	component: ShareButton,
};

export const Default = () => ({
	components: { ShareButton },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan, loggedInUser) }),
		cookieStoreStoryMixin(),
	],
	setup() {
		return {
			loan: fundraisingPartnerLoan,
			lender: loggedInUser.userAccount,
		};
	},
	template: `
		<share-button
			:loan="loan"
			:lender="lender"
			variant="caution"
			campaign="social_share_bp"
		/>
	`,
});
