<template>
	<div
		class="
			stats-section
			tw-pt-2
			tw-pb-3
			tw-px-2
			md:tw-px-4
			tw-rounded
			tw-flex
			tw-flex-col md:tw-flex-row
			tw-justify-between
			tw-items-center
		"
	>
		<div
			class="tw-inline-flex tw-flex-wrap tw-w-full lg:tw-w-9/12
					tw-justify-center tw-gap-x-5 md:tw-gap-x-6 tw-break-aft"
		>
			<div class="tw-flex tw-gap-x-5">
				<StatItem :value="userBalance" label="Lending<br>balance" prefix="$" />
				<StatItem :value="livesTouched" :label="livesTouchedLabel" />
			</div>
			<div class="tw-flex tw-gap-x-5">
				<StatItem :value="totalAmountLent" label="in loans<br>funded" prefix="$" />
				<StatItem :value="totalCountriesLentTo" :label="countryLabel" class="tw-hidden lg:tw-flex" />
			</div>
		</div>
		<div class="md:tw-w-3/12 tw-h-full tw-w-full tw-mt-1 tw-pt-1 md:tw-pt-0">
			<div class="tw-flex tw-flex-col">
				<KvButton
					to="/lend-by-category"
					v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
					variant="secondary"
				>
					Make a loan
				</KvButton>
			</div>
		</div>
	</div>
</template>

<script setup>
import numeral from 'numeral';
import logReadQueryError from '#src/util/logReadQueryError';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import StatItem from '#src/components/MyKiva/StatItem';
import { KvButton } from '@kiva/kv-components';
import {
	ref,
	computed,
	onMounted,
	inject,
} from 'vue';

const apollo = inject('apollo');

defineProps({
	userBalance: {
		type: String,
		default: '',
	},
});

const livesTouched = ref(0);
const totalAmountLent = ref(0);
const totalCountriesLentTo = ref(0);

const countryLabel = computed(() => {
	return totalCountriesLentTo.value === 1 ? 'Country<br>lent to' : 'Countries<br>lent to';
});

const livesTouchedLabel = computed(() => {
	return livesTouched.value === 1 ? 'Life<br>touched' : 'Lives<br>touched';
});

onMounted(() => {
	try {
		const result = apollo.readQuery({ query: lendingStatsQuery });

		livesTouched.value = result.my?.lendingStats?.lentTo?.borrowers?.totalCount ?? 0;
		totalAmountLent.value = numeral(result.my?.userStats?.amount_of_loans ?? 0).value();
		totalCountriesLentTo.value = result.my?.lendingStats?.lentTo?.countries?.totalCount ?? 0;
	} catch (e) {
		logReadQueryError(e, 'MyKivaPage myKivaStatsQuery');
	}
});
</script>

<style scoped>
.stats-section {
	background-image: url('/src/assets/images/my-kiva/stats-bg.jpg');
}
</style>
