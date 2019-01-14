<template>
	<www-page>
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="row page-content">
			<the-portfolio-tertiary-menu slot="tertiary" class="show-for-large" />
			<div class="small-12 large-9 columns">
				<h1>Lending stats</h1>
				<p>This is a snapshot of your lending activity on Kiva.
				Use this page to collect loans and hit milestones along the way.</p>
				<hr>
				<stats-section
					title="Countries &amp; Territories*"
					noun="country"
					:not-lent-to="countriesNotLentTo"
					:lent-to="countriesLentTo"
					:total="totalCountries"
					item-key="isoCode"
					unlent-url="/lend/countries-not-lent"
				/>
				<hr>
				<stats-section
					title="Sectors"
					noun="sector"
					:not-lent-to="sectorsNotLentTo"
					:lent-to="sectorsLentTo"
					:icon-key="iconForSector"
				/>
				<hr>
				<stats-section
					title="Activities"
					noun="activity"
					:not-lent-to="activitiesNotLentTo"
					:lent-to="activitiesLentTo"
				/>
				<hr>
				<stats-section
					title="Field Partners*"
					noun="Field Partner"
					:not-lent-to="partnersNotLentTo"
					:lent-to="partnersLentTo"
					:total="totalPartners"
					query="partner"
				/>
				<hr>
				<p>* Please note, Kiva is continually adding and ending partnerships as we deem necessary.
				This means, you may end up supporting a loan in a country or through a Field Partner that
				is no longer active and therefore not included in the total number of countries or partners
				noted on this page. For this reason, it is possible to see discrepancies between the number
				you've supported and the number to go.</p>
			</div>
		</div>
	</www-page>
</template>

<script>
import _differenceBy from 'lodash/differenceBy';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import lendingStatsQuery from '@/graphql/query/myLendingStats.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import StatsSection from './StatsSection';

export default {
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		StatsSection
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Lending Stats'
	},
	data() {
		return {
			countriesLentTo: [],
			countriesNotLentTo: [],
			totalCountries: 0,
			sectorsLentTo: [],
			sectorsNotLentTo: [],
			activitiesLentTo: [],
			activitiesNotLentTo: [],
			partnersLentTo: [],
			partnersNotLentTo: [],
			totalPartners: 0,
		};
	},
	apollo: {
		query: lendingStatsQuery,
		preFetch: true,
		result({ data }) {
			const allCountries = _sortBy(_map(_get(data, 'lend.countryFacets'), 'country'), 'name');
			this.countriesLentTo = _sortBy(_get(data, 'my.lendingStats.countriesLentTo'), 'name');
			this.countriesNotLentTo = _differenceBy(allCountries, this.countriesLentTo, 'isoCode');
			this.totalCountries = allCountries.length;

			const allSectors = _sortBy(_get(data, 'general.kivaStats.sectors'), 'name');
			this.sectorsLentTo = _sortBy(_get(data, 'my.lendingStats.sectorsLentTo'), 'name');
			this.sectorsNotLentTo = _differenceBy(allSectors, this.sectorsLentTo, 'id');

			const allActivities = _sortBy(_get(data, 'general.kivaStats.activities'), 'name');
			this.activitiesLentTo = _sortBy(_get(data, 'my.lendingStats.activitiesLentTo'), 'name');
			this.activitiesNotLentTo = _differenceBy(allActivities, this.activitiesLentTo, 'id');

			const allPartners = _sortBy(_get(data, 'general.partners.values'), 'name');
			this.partnersLentTo = _sortBy(_get(data, 'my.lendingStats.partnersLentTo'), 'name');
			this.partnersNotLentTo = _differenceBy(allPartners, this.partnersLentTo, 'id');
			this.totalPartners = _get(data, 'general.partners.totalCount');
		},
		errorHandlers: {
			'api.authenticationRequired': ({ route, kvAuth0 }) => {
				if (kvAuth0.enabled) {
					return Promise.reject({
						path: '/ui-login',
						query: { doneUrl: route.fullPath }
					});
				}
				return Promise.reject({
					path: '/login',
					query: { doneUrl: route.fullPath.slice(1) }
				});
			}
		}
	},
	methods: {
		iconForSector(sector) {
			return `sector-${sector.name.toLowerCase().replace(' ', '-')}`;
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
