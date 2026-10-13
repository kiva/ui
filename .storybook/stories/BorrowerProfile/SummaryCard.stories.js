import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	loggedInUser,
	fundraisingPartnerLoan,
	longLocationPartnerLoan,
	fullyFundedLoan,
	payingBackLoan,
	overpaidPayingBackLoan,
	endedLoan,
	pfpLoan,
} from './mockLoanFixtures';

function summaryCardStory(loan, myUser = null, props = {}) {
	const queryResult = createQueryResult(loan, myUser);
	return () => ({
		components: { SummaryCard },
		mixins: [
			apolloStoryMixin({ queryResult }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		setup() {
			return { loan, props };
		},
		template: `
			<summary-card
				:loan="loan"
				v-bind="props"
			/>
		`,
	});
}

export default {
	title: 'Components/BorrowerProfile/SummaryCard',
	component: SummaryCard,
};

export const Fundraising = summaryCardStory(fundraisingPartnerLoan, loggedInUser);

export const LongLocation = summaryCardStory(longLocationPartnerLoan, loggedInUser);
LongLocation.storyName = 'Long location';

export const FullyFunded = summaryCardStory(fullyFundedLoan);

export const PayingBack = summaryCardStory(payingBackLoan, loggedInUser);

export const PayingBackOverpaid = summaryCardStory(overpaidPayingBackLoan, loggedInUser);
PayingBackOverpaid.storyName = 'Paying Back (overpaid)';

export const Ended = summaryCardStory(endedLoan, loggedInUser);

export const PFP = summaryCardStory(pfpLoan, loggedInUser);
PFP.storyName = 'Private Fundraising Period';

// New user version: "Loan details" and "Share" live in the card (kebab below the md breakpoint)
export const NewUserActions = summaryCardStory(fundraisingPartnerLoan, null, { showActions: true });
NewUserActions.storyName = 'New user version (actions in card)';

export const Loading = () => ({
	components: { SummaryCard },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan), loading: true }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	setup() {
		return { loan: fundraisingPartnerLoan };
	},
	template: `
		<summary-card
			:loan="loan"
		/>
	`,
});
