import Vue from "vue";
import apolloStoryMixin from "../mixins/apollo-story-mixin";
import cookieStoreStoryMixin from "../mixins/cookie-store-story-mixin";
import kvAuth0StoryMixin from "../mixins/kv-auth0-story-mixin";

import TheHeader from "#src/components/WwwFrame/TheHeader";

// import plugins
import kivaPlugins from "#src/plugins";
Vue.use(kivaPlugins);

const loggedIn = {
	my: {
		userAccount: {
			id: 1017469,
			balance: "0.00",
			promoBalance: "0.00",
		},
		lender: {
			image: {
				id: 726677,
				url:
					"https://www-dev-kiva-org.freetls.fastly.net/img/s140/726677.jpg",
			},
		},
		isBorrower: false,
		mostRecentBorrowedLoan: null,
		trustee: null,
	},
};

const itemInCart = {
	shop: {
		nonTrivialItemCount: 123,
	},
};

const loggedInUserItemInCart = {
	...itemInCart,
	...loggedIn,
};

const loggedInLargeCart = {
	...loggedIn,
	shop: {
		nonTrivialItemCount: 3,
		basket: {
			id: 1,
			items: {
				values: [
					{
						id: 1,
						price: '600',
					},
					{
						id: 1,
						price: '500',
					},
					{
						id: 1,
						price: '100',
					},
				],
			},
		}
	}
};

const provideMockedApollo = (mockedResult) => {
	return {
		readQuery() {
			return mockedResult;
		},
		readFragment() {
			return mockedResult;
		},
		query() {
			return Promise.resolve(mockedResult);
		},
		watchQuery() {
			return {
				subscribe() { },
			};
		},
	};
};

const args = {
	hideSearchInHeader: false,
	minimal: false,
	corporate: false,
	corporateLogoUrl: require("#src/assets/images/logos/visa.svg"),
};

export default {
	title: "WwwFrame/TheHeader",
	component: TheHeader,
	parameters: {
		layout: "fullscreen",
	},
	args,
};

const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	setup() { return args; },
	template: `
		<the-header
			:minimal="minimal"
			:hide-search-in-header="hideSearchInHeader"
		 />
	`,
});

export const Visitor = Default.bind(args);

export const VisitorItemInCart = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(itemInCart),
	},
	setup() { return args; },
	template: `
		<the-header />
	`,
});

export const LoggedIn = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedIn),
	},
	setup() { return args; },
	template: `
		<the-header />
	`,
});

export const LoggedInItemInCart = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInUserItemInCart),
	},
	setup() { return args; },
	template: `
		<the-header />
	`,
});

export const LoggedInLargeCart = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInLargeCart),
	},
	setup() { return args; },
	template: `
		<the-header />
	`,
});

export const CorporateVisitorItemInCart = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(itemInCart),
	},
	setup() { return args; },
	template: `
		<the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
	`,
});

export const CorporateLoggedIn = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedIn),
	},
	setup() { return args; },
	template: `
		<the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
	`,
});

export const CorporateLoggedInItemInCart = (_, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInUserItemInCart),
	},
	setup() { return args; },
	template: `
		<the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
	`,
});

export const HideSearchInHeader = Default.bind({});
HideSearchInHeader.args = {
	...args,
	hideSearchInHeader: true,
};

export const Minimal = Default.bind({});
Minimal.args = {
	...args,
	minimal: true,
};

// TODO: trustee
