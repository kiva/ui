import SimultaneousMatchingInfo from '#src/components/BorrowerProfile/SimultaneousMatchingInfo';

export default {
	title: 'Components/BorrowerProfile/SimultaneousMatchingInfo',
	component: SimultaneousMatchingInfo,
	parameters: {
		viewport: {
			defaultViewport: 'tablet',
		},
	},
};

const capitalOne = { managedAccountId: 203995508, displayName: 'Capital One', ratio: 3, logo: null };
const tripadvisor = { managedAccountId: 204181523, displayName: 'the Tripadvisor Foundation', ratio: 1, logo: null };
const visa = { managedAccountId: 999, displayName: 'Visa', ratio: 1, logo: null };

const story = (args) => ({
	components: { SimultaneousMatchingInfo },
	setup() { return args; },
	template: `
		<simultaneous-matching-info
			:simultaneous-matching="simultaneousMatching"
			:lend-amount="lendAmount"
		/>
	`,
});

export const TwoPartners = story.bind({});
TwoPartners.args = {
	simultaneousMatching: [capitalOne, tripadvisor],
	lendAmount: 25,
};

export const SinglePartner = story.bind({});
SinglePartner.args = {
	simultaneousMatching: [capitalOne],
	lendAmount: 25,
};

export const ThreePartners = story.bind({});
ThreePartners.args = {
	simultaneousMatching: [capitalOne, tripadvisor, visa],
	lendAmount: 25,
};

export const AnonymousPartner = story.bind({});
AnonymousPartner.args = {
	simultaneousMatching: [
		{ managedAccountId: 1, displayName: null, ratio: 1, logo: null },
	],
	lendAmount: 25,
};

export const WithLogo = story.bind({});
WithLogo.args = {
	simultaneousMatching: [
		{
			managedAccountId: 1,
			displayName: 'Visa',
			ratio: 1,
			logo: { id: 10, url: 'https://via.placeholder.com/40/0070d2/ffffff?text=V' },
		},
		tripadvisor,
	],
	lendAmount: 25,
};

export const WithAvatar = story.bind({});
WithAvatar.args = {
	simultaneousMatching: [
		{
			managedAccountId: 1,
			displayName: 'Visa',
			ratio: 1,
			avatar: { id: 20, url: 'https://via.placeholder.com/40/2e7d32/ffffff?text=A' },
			logo: { id: 10, url: 'https://via.placeholder.com/40/0070d2/ffffff?text=L' },
		},
		tripadvisor,
	],
	lendAmount: 25,
};

export const LargeLendAmount = story.bind({});
LargeLendAmount.args = {
	simultaneousMatching: [capitalOne, tripadvisor],
	lendAmount: 100,
};
