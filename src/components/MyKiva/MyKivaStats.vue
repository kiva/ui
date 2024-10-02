<template>
	<section class="tw-flex tw-overflow-hidden tw-flex-col tw-justify-center tw-items-center tw-px-16 tw-py-8 tw-bg-green-800 tw-max-md:tw-px-5">
		<div class="tw-flex tw-w-full tw-max-w-[1042px] tw-max-md:tw-max-w-full">
			<div class="tw-flex tw-z-10 tw-flex-wrap tw-flex-auto tw-gap-16 tw-items-center tw-mr-0 tw-text-neutral-100 tw-max-md:tw-max-w-full">
				<StatItem :value="livesTouched" label="Lives touched" />
				<StatItem :value="totalAmountLent" label="Lent to borrowers" prefix="$" />
				<StatItem :value="completedAchievements" label="Badges earned" />
				<StatItem :value="totalCountriesLentTo" label="Countries reached" />
			</div>
			<div class="tw-flex tw-flex-col tw-shrink-0 tw-self-start tw-text-lg tw-leading-none tw-text-center tw-basis-0 tw-font-[621] tw-grow-0 tw-w-fit">
				<kv-button
					v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
					:href="/lend-by-category"
					variant="secondary"
				>
					Make a loan
				</kv-button>
				<a
					v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
					href="/portfolio/lending-stats"
					class="tw-mt-5 tw-text-white"
				>
					See all lending stats
				</a>
			</div>
		</div>
	</section>
</template>
<script>
import StatItem from '#src/components/Kv/StatItem.vue';
import lendingStatsQuery from '@/graphql/query/myLendingStats.graphql';
import KvButton from '@kiva/kv-components/vue/KvButton';

export default {
	name: 'LendingStats',
	components: {
		StatItem,
		KvButton
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Lending Stats'
	},
	data() {
		return {
			livesTouched: 0,
			totalAmountLent: 0,
			totalCountriesLentTo: 0
		};
	},
	apollo: {
		query: lendingStatsQuery,
		preFetch: true,
		result({ data }) {
			this.livesTouched = data?.my?.lendingStats?.lentTo?.borrowers?.totalCount ?? 0;
			this.totalAmountLent = data?.my?.userStats?.amount_of_loans ?? 0;
			this.totalCountriesLentTo = data?.my?.statsPerCountry?.totalCount ?? 0;
			this.userId = data?.my?.userAccount?.id;
		},
	},
	computed: {
		completedAchievements() {
			return this.allAchievements.filter(
				achievement => achievement.status === 'COMPLETE'
			);
		}
	}
};
</script>
