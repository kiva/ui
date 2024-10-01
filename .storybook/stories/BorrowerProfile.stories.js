import BorrowerProfile from '#src/pages/BorrowerProfile/BorrowerProfile'
import FundedBorrowerProfile from '#src/components/BorrowerProfile/FundedBorrowerProfile'

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import { mockLoansArray } from '../utils';

const mockLoans = mockLoansArray(3);

const queryResult = {
	data: {
		lend: {
			loan: mockLoans[0]
		},
		fundraisingLoans: {
			values: [
				{
					id: 2413188
				},
				{
					id: 2411288
				},
				{
					id: 2406410
				},
				{
					id: 2406459
				},
				{
					id: 2406956
				},
				{
					id: 2408858
				}
			]
		},
		ml: {
			relatedLoansByTopics: [
				{
					values: [
						mockLoans[0],
						mockLoans[0],
						mockLoans[0],
						mockLoans[0],
						mockLoans[0]
					]
				}
			]
		}
	}
};

const queryResultPfp = {
	data: {
		lend: {
			loan: {
				...mockLoans[1],
				inPfp: true,
				pfpMinLenders: 700,
			}
		}
	}
};

/* These stories work as intended if you do a hard reload on the storybook page.
 * Navigating between the stories in storybook seems to load cached data of the previous story.
**/
export default {
	title: 'Page/Borrower Profile',
	component: BorrowerProfile,
	parameters: {
		layout: 'fullscreen',
	},
};

export const Default = () => ({
	components: { BorrowerProfile },
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `<borrower-profile />`,
});

export const Funded = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { FundedBorrowerProfile },
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	setup() { return { loan: mockLoans[0], hash: mockLoans[0].image.hash }; },
	template: `<funded-borrower-profile :loan="loan" :hash="hash" />`,
});

export const PrivateFundraisingPeriod = () => ({
	components: { BorrowerProfile },
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [apolloStoryMixin({ queryResult: queryResultPfp }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `<borrower-profile />`,

});
