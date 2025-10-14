import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';

export const COUNTRIES_NOT_LENT_TO_EXP = 'combo_page_countries_not_lent_to';

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			isCountriesNotLentToExp: false,
		};
	},
	computed: {
		countriesNotLentToUrl() {
			return this.isCountriesNotLentToExp
				? '/lend/filter?countries-not-lent-to=true'
				: '/lend/countries-not-lent';
		},
	},
	mounted() {
		this.isCountriesNotLentToExp = this.apollo.readFragment({
			id: `Experiment:${COUNTRIES_NOT_LENT_TO_EXP}`,
			fragment: experimentVersionFragment,
		}) ?? {};
	},
};
