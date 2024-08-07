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
		team: null,
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

const loggedInWithOneTeam = {
	general: {
		teamsMenuEnabled: {
			key: 'teams_in_navbar',
			value: true,
		}
	},
	my: {
		...loggedIn.my,
		teams: {
			totalCount: 1,
			values: [
				{
					id: 1,
					team: {
						id: 1,
						name: 'Team 1',
						teamPublicId: 'team1',
					}
				},
			],
		},
	},
};

const loggedInWithMultipleTeams = {
	general: {
		teamsMenuEnabled: {
			key: 'teams_in_navbar',
			value: true,
		}
	},
	my: {
		...loggedIn.my,
		teams: {
			totalCount: 6,
			values: [
				{
					id: 1,
					team: {
						id: 1,
						name: '(A+) Atheists, Agnostics, Skeptics, Freethinkers, Secular Humanists and the Non-Religious',
						teamPublicId: 'aplus',
					}
				},
				{
					id: 2,
					team: {
						id: 2,
						name: 'Team 2',
						teamPublicId: 'team2',
					}
				},
				{
					id: 3,
					team: {
						id: 3,
						name: 'Team 3',
						teamPublicId: 'team3',
					}
				},
				{
					id: 4,
					team: {
						id: 4,
						name: 'Team 4',
						teamPublicId: 'team4',
					}
				},
				{
					id: 5,
					team: {
						id: 5,
						name: 'Team 5',
						teamPublicId: 'team5',
					}
				},
				{
					id: 6,
					team: {
						id: 6,
						name: 'Team 6',
						teamPublicId: 'team6',
					}
				},
			],
		},
	},
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

export const LoggedInLargeCart = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInLargeCart),
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
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
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

export const LoggedInWithOneTeam = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInWithOneTeam),
	},
	template: `
		<the-header />
	`,
});

export const LoggedInWithMultipleTeams = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		TheHeader,
	},
	mixins: [cookieStoreStoryMixin(), kvAuth0StoryMixin],
	provide: {
		apollo: provideMockedApollo(loggedInWithMultipleTeams),
	},
	template: `
		<the-header />
	`,
});

// TODO: trustee
