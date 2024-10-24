<template>
	<div class="stats-section tw-py-4">
		<MyKivaContainer>
			<div class="tw-flex tw-justify-between tw-items-center">
				<div
					class="tw-inline-flex tw-flex-wrap tw-w-full lg:tw-w-9/12
					tw-justify-center tw-gap-y-4 tw-gap-x-5 md:tw-gap-x-11 lg:tw-gap-x-6 lg:tw-pr-3"
				>
					<StatItem :value="livesTouched" :label="livesTouchedLabel" />
					<StatItem :value="totalAmountLent" label="in loans<br>funded" prefix="$" />
					<StatItem :value="completedAchievementsNumber" :label="badgesLabel" />
					<StatItem :value="totalCountriesLentTo" :label="countryLabel" class="tw-hidden md:tw-flex" />
				</div>
				<div class="tw-hidden lg:tw-flex tw-flex-col tw-w-3/12 tw-h-full">
					<button
						class="tw-w-full tw-rounded tw-min-h-6 tw-border tw-font-medium tw-text-center tw-text-action
							tw-bg-primary hover:tw-bg-secondary tw-border-tertiary hover:tw-border-primary"
						v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
						@click="$router.push('/lend-by-category')"
						variant="secondary"
					>
						Make a loan
					</button>
					<router-link
						v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
						to="/portfolio/lending-stats"
						class="tw-text-white tw-mx-auto tw-mt-2 hover:tw-text-white tw-font-medium"
					>
						See all lending stats
					</router-link>
				</div>
			</div>
		</MyKivaContainer>
	</div>
</template>
<script setup>
import logReadQueryError from '#src/util/logReadQueryError';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import StatItem from '#src/components/MyKiva/StatItem';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import {
	ref,
	computed,
	onMounted,
	inject,
	toRefs,
} from 'vue';

const apollo = inject('apollo');

const props = defineProps({
	badgesData: {
		type: Array,
		default: () => ([])
	},
	userAchievements: {
		type: Array,
		default: () => ([])
	}
});

const { userAchievements } = toRefs(props);

const livesTouched = ref(0);
const totalAmountLent = ref(0);
const totalCountriesLentTo = ref(0);

const completedAchievements = computed(() => {
	return userAchievements.value.filter(
		achievement => achievement.status === 'COMPLETE' // Update this status field when having from backend
	);
});

const completedAchievementsNumber = computed(() => {
	return completedAchievements.value?.length ?? 0;
});

const countryLabel = computed(() => {
	return totalCountriesLentTo.value === 1 ? 'Country<br>lent to' : 'Countries<br>lent to';
});

const livesTouchedLabel = computed(() => {
	return livesTouched.value === 1 ? 'Live<br>touched' : 'Lives<br>touched';
});

const badgesLabel = computed(() => {
	return completedAchievementsNumber.value === 1 ? 'badge<br>earned' : 'badges<br>earned';
});

onMounted(() => {
	apollo.query({ query: lendingStatsQuery })
		.then(result => {
			livesTouched.value = result.data?.my?.lendingStats?.lentTo?.borrowers?.totalCount ?? 0;
			totalAmountLent.value = +(result.data?.my?.userStats?.amount_of_loans ?? 0);
			totalCountriesLentTo.value = result.data?.my?.statsPerCountry?.totalCount ?? 0;
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage myKivaQuery');
		});
});
</script>

<style scoped>
.stats-section {
	background-image: url('/src/assets/images/my-kiva/stats-bg.jpg');
}
</style>
