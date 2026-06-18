import BorrowerSideSheetWrapper from '#src/components/BorrowerProfile/BorrowerSideSheetWrapper';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/BorrowerSideSheetWrapper',
	component: BorrowerSideSheetWrapper,
};

export const Default = () => ({
	components: { BorrowerSideSheetWrapper },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	provide: {
		$kvTrackEvent: () => {},
	},
	template: `
		<borrower-side-sheet-wrapper
			:selected-loan-id="${fundraisingPartnerLoan.id}"
			:show-side-sheet="true"
			:is-adding="false"
			:basket-items="[]"
		/>
	`,
});

export const Closed = () => ({
	components: { BorrowerSideSheetWrapper },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	provide: {
		$kvTrackEvent: () => {},
	},
	template: `
		<borrower-side-sheet-wrapper
			:selected-loan-id="${fundraisingPartnerLoan.id}"
			:show-side-sheet="false"
			:is-adding="false"
			:basket-items="[]"
		/>
	`,
});
