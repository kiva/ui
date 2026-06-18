import BorrowerSideSheetContent from '#src/components/BorrowerProfile/BorrowerSideSheetContent';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/BorrowerSideSheetContent',
	component: BorrowerSideSheetContent,
};

export const Default = () => ({
	components: { BorrowerSideSheetContent },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	provide: {
		$kvTrackEvent: () => {},
	},
	template: `
		<borrower-side-sheet-content
			:loan-id="${fundraisingPartnerLoan.id}"
			:is-adding="false"
			:basket-items="[]"
		/>
	`,
});
