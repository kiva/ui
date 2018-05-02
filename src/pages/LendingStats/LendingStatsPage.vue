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
					title="Countries & Territories"
					noun="country"
					:not-lent-to="countriesNotLentTo"
					:lent-to="countriesLentTo"
					:total="totalCountries"
					item-key="isoCode"
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
import { mapState } from 'vuex';
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
	metaInfo: {
		title: 'Lending Stats'
	},
	computed: {
		...mapState({
			countriesLentTo: state => state.my.lendingStats.countriesLentTo,
			countriesNotLentTo: state => state.my.lendingStats.countriesNotLentTo,
			totalCountries: state => state.my.lendingStats.totalCountries,
			sectorsLentTo: state => state.my.lendingStats.sectorsLentTo,
			sectorsNotLentTo: state => state.my.lendingStats.sectorsNotLentTo,
			activitiesLentTo: state => state.my.lendingStats.activitiesLentTo,
			activitiesNotLentTo: state => state.my.lendingStats.activitiesNotLentTo,
			partnersLentTo: state => state.my.lendingStats.partnersLentTo,
			partnersNotLentTo: state => state.my.lendingStats.partnersNotLentTo,
			totalPartners: state => state.my.lendingStats.totalPartners,
		}),
	},
	asyncData({ store }) {
		return store.dispatch('getMyLendingStats');
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
