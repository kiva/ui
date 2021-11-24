import Vue from 'vue'
import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';
import {
	lightHeader,
	iwdHeaderTheme,
	wrdHeaderTheme,
	fifteenYearHeaderTheme,
	blueHeader
} from '@/util/siteThemes';

import TheHeader from '@/components/WwwFrame/TheHeader';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

const mockedApolloResponse = {
		shop: {
			nonTrivialItemCount: 1,
		},
		my: {
			userAccount: {
				id: 1017469,
				balance: "0.00",
				promoBalance: "0.00",
			},
			lender: {
				image: {
					id: 726677,
					url: "https://www-dev-kiva-org.freetls.fastly.net/img/s140/726677.jpg",
				},
			},
			isBorrower: false,
			mostRecentBorrowedLoan: null,
			trustee: null,
		}
}

export default {
	title: 'WwwFrame/TheHeader',
	component: TheHeader,
	decorators: [StoryRouter()],
	args: {
		hideSearchInHeader: false,
		minimal: false,
		corporate: false,
		theme: null,
	},
	argTypes: {
		theme: {
			control: {
				type: 'select',
				options: {
					'none': null,
					'lightHeader':lightHeader,
					'iwdHeaderTheme': iwdHeaderTheme,
					'wrdHeaderTheme': wrdHeaderTheme,
					'fifteenYearHeaderTheme': fifteenYearHeaderTheme,
					'blueHeader': blueHeader,
				},
			}
		},
	}
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<the-header
			:minimal="minimal"
			:corporate="corporate"
			:theme="theme"
			:hide-search-in-header="hideSearchInHeader"
		/>
	`,
});

export const HideSearchInHeader = Default.bind({});
HideSearchInHeader.args = {
	hideSearchInHeader: true,
};

export const Minimal = Default.bind({});
Minimal.args = {
	minimal: true,
};

export const Corporate = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader
	},
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	template: `
		<the-header
			:theme="theme"
			:corporate="corporate"
			:corporate-logo-url="corporateLogoUrl"
		/>
	`,
});
Corporate.args = {
	corporate: true,
	corporateLogoUrl: require('@/assets/images/logos/visa.svg'),
};

export const CorporateWithoutCorporateLogoUrl = Corporate.bind({});
CorporateWithoutCorporateLogoUrl.args = {
	corporate: true,
	corporateLogoUrl: null,
};


export const Themed = Default.bind({});
Themed.args = {
	theme: lightHeader,
};

export const LoggedInWithCart = (args, { argTypes }) => ({
	components: {
		TheHeader
	},
	mixins: [kvAuth0StoryMixin],
	provide: {
		apollo: {
			readQuery() {
				return Promise.resolve(mockedApolloResponse);
			},
			query() {
				return Promise.resolve(mockedApolloResponse);
			},
			watchQuery() {
				return {
					subscribe() { }
				}
			},
		},
	},
	template: `
		<the-header />
	`,
});
