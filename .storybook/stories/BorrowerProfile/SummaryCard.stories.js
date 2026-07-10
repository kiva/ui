import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	loggedInUser,
	fundraisingPartnerLoan,
	fullyFundedLoan,
	payingBackLoan,
	overpaidPayingBackLoan,
	endedLoan,
	pfpLoan,
} from './mockLoanFixtures';

function summaryCardStory(loan, myUser = null) {
	const queryResult = createQueryResult(loan, myUser);
	return () => ({
		components: { SummaryCard },
		mixins: [
			apolloStoryMixin({ queryResult }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		setup() {
			return { loan };
		},
		template: `
			<summary-card
				:loan="loan"
			/>
		`,
	});
}

export default {
	title: 'Components/BorrowerProfile/SummaryCard',
	component: SummaryCard,
};

export const Fundraising = summaryCardStory(fundraisingPartnerLoan, loggedInUser);

export const FullyFunded = summaryCardStory(fullyFundedLoan);

export const PayingBack = summaryCardStory(payingBackLoan, loggedInUser);

export const PayingBackOverpaid = summaryCardStory(overpaidPayingBackLoan, loggedInUser);
PayingBackOverpaid.storyName = 'Paying Back (overpaid)';

export const Ended = summaryCardStory(endedLoan, loggedInUser);

export const PFP = summaryCardStory(pfpLoan, loggedInUser);
PFP.storyName = 'Private Fundraising Period';

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
