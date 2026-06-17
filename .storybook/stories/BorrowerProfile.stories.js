import BorrowerProfile from '#src/pages/BorrowerProfile/BorrowerProfile'
import FundedBorrowerProfile from '#src/components/BorrowerProfile/FundedBorrowerProfile'

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import { mockLoansArray } from '../utils';

const mockLoans = mockLoansArray(3);

const queryResult = {
	data: {
		general: {
			multiMatchingEnabled: { key: 'multiMatchingEnabled', value: 'true' },
		},
		lend: {
			loan: {
				...mockLoans[0],
				simultaneousMatching: [
					{ managedAccountId: 203995508, displayName: 'Capital One', ratio: 3, logo: null },
					{ managedAccountId: 204181523, displayName: 'the Tripadvisor Foundation', ratio: 1, logo: null },
				],
			},
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

// AD-229: PII anonymization shows the borrower's name plus an info icon in the summary card.
const queryResultPiiAnonymized = {
	...queryResult,
	data: {
		...queryResult.data,
		lend: {
			loan: {
				...mockLoans[0],
				anonymizationLevel: 'pii',
			}
		}
	}
};

// AD-230: Full anonymization replaces the loan use with a privacy message + "Learn more" link.
const queryResultFullyAnonymized = {
	...queryResult,
	data: {
		...queryResult.data,
		lend: {
			loan: {
				...mockLoans[0],
				anonymizationLevel: 'full',
				fullLoanUse: 'For the borrower\'s privacy, this loan has been made anonymous.',
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

// AD-229: borrower name with the PII anonymization info icon (anonymizationLevel === 'pii').
export const PiiAnonymized = () => ({
	components: { BorrowerProfile },
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [
		apolloStoryMixin({ queryResult: queryResultPiiAnonymized }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<borrower-profile />`,
});

// AD-230: fully anonymized loan use with the "Learn more" link (anonymizationLevel === 'full').
export const FullyAnonymized = () => ({
	components: { BorrowerProfile },
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [
		apolloStoryMixin({ queryResult: queryResultFullyAnonymized }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<borrower-profile />`,
});
