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
					title="Countries*"
					noun="country"
					:items="[]"
					:lent-to="[]"
					item-key="isoCode"
				/>
				<hr>
				<stats-section
					title="Sectors"
					noun="sector"
					:items="sectorItems"
					:lent-to="sectorLentTo"
					:icon-key="iconForSector"
				/>
				<hr>
				<stats-section
					title="Activities"
					noun="activity"
					:items="[]"
					:lent-to="[]"
				/>
				<hr>
				<stats-section
					title="Field Partners*"
					noun="Field Partner"
					:items="[]"
					:lent-to="[]"
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
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import StatsSection from './StatsSection';

export default {
	data() {
		return {
			sectorItems: [
				{ id: 1, name: 'Agriculture' },
				{ id: 9, name: 'Arts' },
				{ id: 5, name: 'Clothing' },
				{ id: 14, name: 'Construction' },
				{ id: 15, name: 'Education' },
				{ id: 17, name: 'Entertainment' },
				{ id: 12, name: 'Food' },
				{ id: 6, name: 'Health' },
				{ id: 10, name: 'Housing' },
				{ id: 8, name: 'Manufacturing' },
				{ id: 16, name: 'Personal Use' },
				{ id: 7, name: 'Retail' },
				{ id: 4, name: 'Services' },
				{ id: 3, name: 'Transportation' },
				{ id: 13, name: 'Wholesale' },
			],
			sectorLentTo: [
				{ id: 9, name: 'Arts' },
				{ id: 15, name: 'Education' },
				{ id: 17, name: 'Entertainment' },
				{ id: 12, name: 'Food' },
				{ id: 6, name: 'Health' },
				{ id: 3, name: 'Transportation' },
				{ id: 13, name: 'Wholesale' },
			],
		};
	},
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		StatsSection
	},
	metaInfo: {
		title: 'Lending Stats'
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
