<!--  eslint-disable max-len -->
<template>
	<WwwPage main-class="tw-bg-secondary tw-pb-3">
		<KvPageContainer>
			<KvGrid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<div class="tw-col-span-12 tw-pt-1.5 md:tw-pt-3">
					<div class="tw-py-2 md:tw-py-3">
						<h1 class="tw-mb-2 tw-break-words">
							<div>
								My Giving Funds
							</div>
						</h1>
					</div>
					<div
						v-if="activeFundraisers?.length"
						class="tw-pb-2 md:tw-pb-3"
					>
						<h3 class="tw-mb-2">
							Active Fundraisers
						</h3>
						<div
							class="tw-rounded tw-p-2 tw-bg-primary"
						>
							<KvLoadingPlaceholder
								v-if="loading"
								class="md:!tw-mt-1 !tw-w-1/4"
								style="height: 32px; margin-top: 2px;"
							/>
							<div
								v-for="(fund, i) in activeFundraisers"
								:key="`active-fundraiser-${i}`"
							>
								You hava active fundraiser for <b>{{ fund.name }}</b> <a
									:href="`/gf-beta/${fund.id}`"
									target="_blank"
									v-kv-track-event="['giving-funds', 'click', 'View active fundraiser']"
								>View</a>
							</div>
						</div>
					</div>
					<div
						v-if="givingFundsEntries?.length"
					>
						<h3 class="tw-mb-2">
							Giving Funds
						</h3>
						<div
							v-for="(fund, i) in givingFundsEntries"
							:key="`fund-${i}`"
							class="tw-rounded tw-p-2 tw-bg-primary tw-mb-2"
						>
							<div class="tw-flex tw-items-center tw-justify-between">
								<div>
									<h4 class="tw-mb-1">
										{{ fund?.campaign?.category?.name }}
									</h4>
									<p class="tw-text-subhead">
										{{ fund?.campaign?.category?.description }}
									</p>
									<p class="">
										Total Donated: <b>{{ fund?.amountDonated }}</b>
									</p>
								</div>
								<KvButton
									:href="`/gf-beta/${fund.id}`"
									target="_blank"
									variant="secondary"
									v-kv-track-event="['giving-funds', 'click', 'View giving fund']"
								>
									View Fund
								</KvButton>
							</div>
						</div>
					</div>
				</div>
			</KvGrid>
		</KvPageContainer>
	</WwwPage>
</template>

<script setup>
import {
	computed,
	onMounted,
	ref,
	inject,
} from 'vue';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import {
	KvPageContainer,
	KvGrid,
	KvButton,
	KvLoadingPlaceholder,
} from '@kiva/kv-components';
import logFormatter from '#src/util/logFormatter';
import myGivingFundsQuery from '#src/graphql/query/portfolio/myGivingFunds.graphql';

const apollo = inject('apollo');

const loading = ref(true);
const givingFundsInfo = ref({});
const givingFundsTotalCount = ref(0);
const givingFundsEntries = ref([]);

const activeFundraisers = computed(() => {
	const fundsWithActiveFundraisers = givingFundsEntries?.value?.filter(fund => {
		const activeFundGoals = fund?.goals?.values?.filter(goal => {
			return goal?.status === 'IN_PROGRESS';
		});
		return activeFundGoals?.length > 0;
	}) ?? [];
	return fundsWithActiveFundraisers.map(fund => {
		const activeFundGoal = fund?.goals?.values?.find(goal => goal?.status === 'IN_PROGRESS');
		return {
			name: fund?.campaign?.category?.name,
			id: fund?.id,
			activeFundGoal,
		};
	});
});

const fetchGivingFundData = async () => {
	try {
		const response = await apollo.query({
			query: myGivingFundsQuery,
		});
		givingFundsInfo.value = response?.data?.my?.givingFunds;
		givingFundsTotalCount.value = response?.data?.my?.givingFunds?.totalCount;
		givingFundsEntries.value = response?.data?.my?.givingFunds?.values ?? [];
		loading.value = false;
	} catch (error) {
		logFormatter(`Error fetching giving fund data: ${error}`, 'error');
	}
};

onMounted(() => {
	fetchGivingFundData();
});
</script>
