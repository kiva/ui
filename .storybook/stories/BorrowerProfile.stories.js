import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import BorrowerProfile from '@/pages/BorrowerProfile/BorrowerProfile'
import FundedBorrowerProfile from '@/pages/BorrowerProfile/FundedBorrowerProfile'

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import { mockLoansArray } from '../utils';

const mockLoans = mockLoansArray(3);

const queryResult = {
	data: {
		lend: {
			loan: mockLoans[0]
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

export const Funded = () => ({
	components: { FundedBorrowerProfile	},
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `<funded-borrower-profile />`,
});

export const PrivateFundraisingPeriod = () => ({
	components: { BorrowerProfile},
	parameters: {
		layout: 'fullscreen',
	},
	mixins: [apolloStoryMixin({ queryResult: queryResultPfp }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `<borrower-profile />`,

});
