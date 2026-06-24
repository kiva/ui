import LendersAndTeams from '#src/components/BorrowerProfile/LendersAndTeams';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/LendersAndTeams',
	component: LendersAndTeams,
};

const lendersLoan = {
	...fundraisingPartnerLoan,
	lenders: {
		totalCount: 23,
		values: [
			{
				id: 201,
				name: 'Lucy D',
				publicId: 'lucy',
				image: { id: 'img1', hash: 'abc123' },
				lenderPage: { id: 'lp1', whereabouts: 'Beverly Hills, CA' },
			},
			{
				id: 202,
				name: 'Erica',
				publicId: 'erica',
				image: { id: 'img2', hash: 'def456' },
				lenderPage: { id: 'lp2', whereabouts: 'Anytown, CA' },
			},
			{
				id: 203,
				name: 'Joy',
				publicId: 'joy',
				image: { id: 'img3', hash: 'ghi789' },
				lenderPage: { id: 'lp3', whereabouts: 'San Francisco, CA' },
			},
		],
		__typename: 'LenderCollection',
	},
};

const teamsLoan = {
	...fundraisingPartnerLoan,
	teams: {
		totalCount: 5,
		values: [
			{
				id: 1,
				name: 'Kiva Lending Team',
				teamPublicId: 'kiva',
				category: 'Common Interest',
				image: { id: 't1', hash: 'team1' },
				lenderCount: 500,
				lenderCountForLoan: 3,
			},
			{
				id: 2,
				name: 'The A Team',
				teamPublicId: 'theateam',
				category: 'Common Interest',
				image: { id: 't2', hash: 'team2' },
				lenderCount: 200,
				lenderCountForLoan: 1,
			},
		],
		__typename: 'TeamCollection',
	},
};

const emptyLendersLoan = {
	...fundraisingPartnerLoan,
	lenders: {
		totalCount: 0,
		values: [],
		__typename: 'LenderCollection',
	},
};

export const LendersPopulated = () => ({
	components: { LendersAndTeams },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(lendersLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lenders-and-teams :loan-id="${lendersLoan.id}" display-type="lenders" />`,
});

export const TeamsPopulated = () => ({
	components: { LendersAndTeams },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(teamsLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lenders-and-teams :loan-id="${teamsLoan.id}" display-type="teams" />`,
});

export const EmptyLenders = () => ({
	components: { LendersAndTeams },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(emptyLendersLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lenders-and-teams :loan-id="${emptyLendersLoan.id}" display-type="lenders" />`,
});
