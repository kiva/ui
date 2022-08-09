import Vue from "vue";
import apolloStoryMixin from "../mixins/apollo-story-mixin";
import cookieStoreStoryMixin from "../mixins/cookie-store-story-mixin";
import kvAuth0StoryMixin from "../mixins/kv-auth0-story-mixin";

import TheHeader from "@/components/WwwFrame/TheHeader";

// import plugins
import kivaPlugins from "@/plugins";
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
		nonTrivialItemCount: 1234,
	},
};

const loggedInUserItemInCart = {
	...itemInCart,
	...loggedIn,
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
				subscribe() {},
			};
		},
	};
};

export default {
	title: "WwwFrame/TheHeader",
	component: TheHeader,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		hideSearchInHeader: false,
		minimal: false,
		corporate: false,
		corporateLogoUrl: require("@/assets/images/logos/visa.svg"),
	},
};

const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<the-header
			:minimal="minimal"
			:hide-search-in-header="hideSearchInHeader"
		 />
	`,
});

export const Visitor = Default.bind({});

export const VisitorItemInCart = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(itemInCart),
	},
	template: `
		<the-header />
	`,
});

export const LoggedIn = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedIn),
	},
	template: `
		<the-header />
	`,
});

export const LoggedInItemInCart = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInUserItemInCart),
	},
	template: `
		<the-header />
	`,
});

export const CorporateVisitorItemInCart = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(itemInCart),
	},
	template: `
		<the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
	`,
});

export const CorporateLoggedIn = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedIn),
	},
	template: `
		<the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
	`,
});

export const CorporateLoggedInItemInCart = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInUserItemInCart),
	},
	template: `
	<the-header :corporate="true" :corporate-logo-url="corporateLogoUrl" />
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

// TODO: trustee
