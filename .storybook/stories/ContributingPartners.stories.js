import ContributingPartners from '#src/components/BorrowerProfile/ContributingPartners';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const capitalOne = { managedAccountId: 203995508, displayName: 'Capital One', ratio: 3, logo: null };
const tripadvisor = { managedAccountId: 204181523, displayName: 'the Tripadvisor Foundation', ratio: 1, logo: null };

function makeQueryResult(simultaneousMatching) {
	return {
		data: {
			general: {
				multiMatchingEnabled: { key: 'multiMatchingEnabled', value: 'true' },
			},
			lend: {
				loan: {
					id: 3175014,
					status: 'fundraising',
					simultaneousMatching,
				},
			},
		},
	};
}

const story = (simultaneousMatching) => () => ({
	components: { ContributingPartners },
	mixins: [apolloStoryMixin({ queryResult: makeQueryResult(simultaneousMatching) }), cookieStoreStoryMixin()],
	template: `<contributing-partners :loan-id="3175014" />`,
});

export default {
	title: 'Components/BorrowerProfile/ContributingPartners',
	component: ContributingPartners,
};

export const TwoPartners = story([capitalOne, tripadvisor]);
export const SinglePartner = story([capitalOne]);
export const AnonymousPartner = story([{ managedAccountId: 1, displayName: null, ratio: 1, logo: null }]);
export const WithLogo = story([
	{
		managedAccountId: 1,
		displayName: 'Visa',
		ratio: 1,
		logo: { id: 10, url: 'https://via.placeholder.com/96/0070d2/ffffff?text=V' },
	},
	tripadvisor,
]);
