<template>
	<www-page>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<the-portfolio-tertiary-menu class="tw-pt-2 tw-col-span-3 tw-hidden md:tw-block" />
				<div
					class="
						tw-col-span-12 md:tw-col-span-9
						tw-pt-4 tw-pb-8
						md:tw-pt-6 md:tw-pb-12
						lg:tw-pt-8 lg:tw-pb-16
					"
				>
					<h1 class="tw-mb-4">
						Lending stats
					</h1>
					<p class="tw-mb-2">
						This is a snapshot of your lending activity on Kiva.
						Use this page to collect loans and hit milestones along the way.
					</p>
					<hr class="tw-border-tertiary tw-my-4">
					<stats-section
						title="Countries &amp; Territories*"
						noun="country"
						:not-lent-to="countriesNotLentTo"
						:lent-to="countriesLentTo"
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
						title="Lending Partners*"
						noun="Lending Partner"
						:not-lent-to="partnersNotLentTo"
						:lent-to="partnersLentTo"
						query="partner"
						section-id="lend-stat-fieldpartner"
						show-more-id="show-more-fieldpartner"
						lend-new-id="lend-new-fieldpartner"
					/>
					<hr class="tw-border-tertiary tw-mt-4">
					<badges-section
						:badges-data="badgesData"
						:is-loading="badgesLoading"
						:loans="loans"
						:completed-achievements="completedAchievements"
					/>
					<hr class="tw-border-tertiary tw-mb-4">
					<p>
						* Please note, Kiva is continually adding and ending partnerships as we deem necessary.
						This means, you may end up supporting a loan in a country or through a Lending Partner that
						is no longer active and therefore not included in the total number of countries or partners
						noted on this page. For this reason, it is possible to see discrepancies between the number
						you've supported and the number to go.
					</p>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import _differenceBy from 'lodash/differenceBy';
import _sortBy from 'lodash/sortBy';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { KvGrid, KvPageContainer } from '@kiva/kv-components';
import lenderProfileBadgeDataQuery from '#src/graphql/query/lenderProfileBadgeData.graphql';
import useBadgeData from '#src/composables/useBadgeData';
import BadgesSection from './BadgesSection';
import StatsSection from './StatsSection';

const convertToNumberOrString = value => {
	const num = Number(value);

	if (!Number.isNaN(num) && value !== '') {
		return num;
	}

	return value;
};

const checkFilterKey = (data, objectStat) => {
	if (!parseInt(data[0], 10)) {
		return objectStat.name;
	}

	return objectStat.id;
};

export default {
	name: 'LendingStatsPage',
	components: {
		BadgesSection,
		KvGrid,
		KvPageContainer,
		StatsSection,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	head: {
		title: 'Lending Stats'
	},
	data() {
		return {
			countriesLentTo: [],
			countriesNotLentTo: [],
			sectorsLentTo: [],
			sectorsNotLentTo: [],
			activitiesLentTo: [],
			activitiesNotLentTo: [],
			partnersLentTo: [],
			partnersNotLentTo: [],
			userId: null,
			allAchievements: [],
			badgesData: [],
			loans: [],
		};
	},
	apollo: {
		query: lendingStatsQuery,
		preFetch: true,
		result({ data }) {
			const countriesWhereKivaDoesntWork = data?.general?.excluded_countries?.value ?? '';
			/* eslint-disable max-len */
			const activitiesWhereKivaDoesntWork = (data?.general?.excluded_activities?.value ?? '').split(',').map(item => item.replaceAll('"', '')).map(item => convertToNumberOrString(item));
			const partnersWhereKivaDoesntWork = (data?.general?.excluded_partners?.value ?? '').split(',').map(item => item.replaceAll('"', '')).map(item => convertToNumberOrString(item));
			const sectorsWhereKivaDoesntWork = (data?.general?.excluded_sectors?.value ?? '').split(',').map(item => item.replaceAll('"', '')).map(item => convertToNumberOrString(item));
			/* eslint-enable max-len */

			// reduce array of country objects to country property without using lodash
			const countriesReduced = (data?.lend?.countryFacets ?? []).map(country => country.country);
			const activitiesData = data?.general?.kivaStats?.activities ?? [];
			const partnersData = data?.general?.partners?.values ?? [];
			const sectorsData = data?.general?.kivaStats?.sectors ?? [];

			/* eslint-disable max-len */
			const filteredCountries = countriesReduced.filter(country => !countriesWhereKivaDoesntWork.includes(country.isoCode));
			const filteredActivities = activitiesData.filter(activity => !activitiesWhereKivaDoesntWork.includes(checkFilterKey(activitiesWhereKivaDoesntWork, activity)));
			const filteredPartners = partnersData.filter(partner => !partnersWhereKivaDoesntWork.includes(checkFilterKey(partnersWhereKivaDoesntWork, partner)));
			const filteredSectors = sectorsData.filter(sector => !sectorsWhereKivaDoesntWork.includes(checkFilterKey(sectorsWhereKivaDoesntWork, sector)));
			/* eslint-enable max-len */

			const allCountries = _sortBy(filteredCountries, 'name');
			this.countriesLentTo = _sortBy(data?.my?.lendingStats?.countriesLentTo ?? [], 'name');
			this.countriesNotLentTo = _differenceBy(allCountries, this.countriesLentTo, 'isoCode');

			const allSectors = _sortBy(filteredSectors, 'name');
			this.sectorsLentTo = _sortBy(data?.my?.lendingStats?.sectorsLentTo ?? [], 'name');
			this.sectorsNotLentTo = _differenceBy(allSectors, this.sectorsLentTo, 'id');

			const allActivities = _sortBy(filteredActivities, 'name');
			this.activitiesLentTo = _sortBy(data?.my?.lendingStats?.activitiesLentTo, 'name');
			this.activitiesNotLentTo = _differenceBy(allActivities, this.activitiesLentTo, 'id');

			const allPartners = _sortBy(filteredPartners, 'name');
			this.partnersLentTo = _sortBy(data?.my?.lendingStats?.partnersLentTo, 'name');
			this.partnersNotLentTo = _differenceBy(allPartners, this.partnersLentTo, 'id');

			this.userId = data?.my?.userAccount?.id;
		},
	},
	created() {
		this.apollo.query({
			query: lenderProfileBadgeDataQuery,
			variables: {
				contentType: 'challenge',
				limit: 200,
			}
		}).then(({ data }) => {
			const userAchievementProgress = { ...data?.userAchievementProgress ?? {} };
			const contentful = { ...data?.contentful ?? {} };

			this.allAchievements = { userAchievementProgress, contentful };
			this.loans = data?.my?.loans?.values ?? [];
		});
	},
	computed: {
		completedAchievements() {
			const completedBadgesArr = this.getBadgesData();

			completedBadgesArr.sort((a, b) => {
				return new Date(a.earnedAtDate) - new Date(b.earnedAtDate);
			});

			return completedBadgesArr;
		},
		badgesLoading() {
			return !this.badgesData.length;
		}
	},
	methods: {
		getBadgesData() {
			const {
				combineBadgeData, getCompletedBadges, getContentfulLevelData
			} = useBadgeData();

			const badgeAchievementData = [
				...(this.allAchievements?.userAchievementProgress?.lendingAchievements ?? []),
				...(this.allAchievements?.userAchievementProgress?.tieredLendingAchievements ?? [])
			];
			const badgeContentfulData = (this.allAchievements?.contentful?.entries?.items ?? [])
				.map(entry => getContentfulLevelData(entry));

			this.badgesData = combineBadgeData(badgeAchievementData, badgeContentfulData);

			return getCompletedBadges(this.badgesData);
		},
		iconForSector(sector) {
			const sectorName = sector.name
				.replace(/&/g, '')
				.replace(/\s+/g, '-')
				.trim()
				.toLowerCase();

			return `sector-${sectorName}`;
		}
	}
};
</script>
