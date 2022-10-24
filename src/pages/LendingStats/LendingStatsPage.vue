<template>
	<www-page>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<div class="row">
				<the-portfolio-tertiary-menu class="show-for-large" />
				<div class="small-12 large-9 columns">
					<h1 class="tw-mb-4">
						Lending stats
					</h1>
					<p class="tw-mb-2">
						This is a snapshot of your lending activity on Kiva.
						Use this page to collect loans and hit milestones along the way.
					</p>
					<template v-if="hasBadges">
						<hr class="tw-border-tertiary tw-my-4">
						<badges-section
							v-for="(badge, index) in completedAchievements"
							:key="index"
							:badges-obtained="completedAchievements.length"
							:total-badges="allAchievements.length"
							:achievement-id="badge.achievementId"
						/>
					</template>
					<hr class="tw-border-tertiary tw-my-4">
					<stats-section
						title="Countries &amp; Territories*"
						noun="country"
						:not-lent-to="countriesNotLentTo"
						:lent-to="countriesLentTo"
						:total="totalCountries"
						item-key="isoCode"
						unlent-url="/lend/countries-not-lent"
						section-id="lend-stat-countries"
						show-more-id="show-more-countries"
						lend-new-id="lend-new-country"
					/>
					<hr class="tw-border-tertiary tw-my-4">
					<stats-section
						title="Sectors"
						noun="sector"
						:not-lent-to="sectorsNotLentTo"
						:lent-to="sectorsLentTo"
						:icon-key="iconForSector"
						section-id="lend-stat-sectors"
						show-more-id="show-more-sectors"
						lend-new-id="lend-new-sector"
					/>
					<hr class="tw-border-tertiary tw-my-4">
					<stats-section
						title="Activities"
						noun="activity"
						:not-lent-to="activitiesNotLentTo"
						:lent-to="activitiesLentTo"
						section-id="lend-stat-activities"
						show-more-id="show-more-activities"
						lend-new-id="lend-new-activities"
					/>
					<hr class="tw-border-tertiary tw-my-4">
					<stats-section
						title="Field Partners*"
						noun="Field Partner"
						:not-lent-to="partnersNotLentTo"
						:lent-to="partnersLentTo"
						:total="totalPartners"
						query="partner"
						section-id="lend-stat-fieldpartner"
						show-more-id="show-more-fieldpartner"
						lend-new-id="lend-new-fieldpartner"
					/>
					<hr class="tw-border-tertiary tw-my-4">
					<p>
						* Please note, Kiva is continually adding and ending partnerships as we deem necessary.
						This means, you may end up supporting a loan in a country or through a Field Partner that
						is no longer active and therefore not included in the total number of countries or partners
						noted on this page. For this reason, it is possible to see discrepancies between the number
						you've supported and the number to go.
					</p>
				</div>
			</div>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import _differenceBy from 'lodash/differenceBy';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import lendingStatsQuery from '@/graphql/query/myLendingStats.graphql';
import userAchievementsProgress from '@/graphql/query/userAchievementsProgress.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '@/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import BadgesSection from '@/pages/LendingStats/BadgesSection';
import StatsSection from './StatsSection';

export default {
	name: 'LendingStatsPage',
	components: {
		BadgesSection,
		KvDefaultWrapper,
		StatsSection,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
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
			userId: null,
			allAchievements: [],
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

			this.userId = data?.my?.userAccount?.id;
		},
	},
	created() {
		this.apollo.query({
			query: userAchievementsProgress,
			variables: {
				userId: this.userId.toString(),
			},
		}).then(({ data }) => {
			this.allAchievements = data?.userAchievementProgress?.achievementProgress;
		});
	},
	computed: {
		completedAchievements() {
			return this.allAchievements.filter(
				achievement => achievement.status === 'COMPLETE'
			);
		},
		hasBadges() {
			return this.completedAchievements.length > 0;
		}
	},
	methods: {
		iconForSector(sector) {
			return `sector-${sector.name.toLowerCase().replace(' ', '-')}`;
		}
	}
};
</script>
