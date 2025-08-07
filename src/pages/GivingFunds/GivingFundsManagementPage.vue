<template>
	<WwwPage main-class="tw-bg-secondary tw-pb-5">
		<KvPageContainer>
			<KvGrid class="tw-grid-cols-12 md:tw-mx-0">
				<div class="tw-col-span-12 tw-pt-1.5 md:tw-pt-3">
					<div class="tw-py-2 md:tw-py-3 tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
						<h1 class="tw-mb-2 tw-break-words">
							<div>
								Giving Funds
							</div>
						</h1>
						<kv-button
							variant="primary"
							:href="`#`"
							@click.prevent="createNewFund"
							v-kv-track-event="['giving-funds', 'click', 'Start a new fund']"
						>
							Start a new fund
						</kv-button>
					</div>

					<kv-loading-placeholder
						v-if="loading"
						class="tw-rounded tw-mb-2 tw-w-full" :style="{ height: '150px' }"
					/>

					<div
						v-else-if="givingFundsEntries?.length"
					>
						<kv-card-frame
							v-for="(fund, i) in givingFundsEntries"
							:key="`fund-${i}`"
							class="tw-mb-2"
						>
							<div class="tw-p-2">
								<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
									<div>
										<h3 class="tw-mb-1">
											{{ fund?.campaign?.category?.name }}
										</h3>
										<!--  eslint-disable max-len -->
										<div
											v-if="fund?.goals?.values?.filter(goal => goal?.status === 'IN_PROGRESS')?.length"
										>
											<h4
												class="tw-bg-brand-200 tw-pt-1 tw-pb-0.5 tw-px-1.5 tw-rounded-full tw-inline-block tw-mb-2 tw-mr-1"
											>
												Actively fundraising
											</h4>
											<kv-text-link
												:href="`/gf-beta/${fund.id}`"
												target="_blank"
												v-kv-track-event="['giving-funds', 'click', 'View active fundraiser']"
											>
												View
											</kv-text-link>
										</div>
										<!-- eslint-enable max-len -->
										<!--  eslint-disable max-len -->
										<p v-if="fund?.campaign?.lendingStats?.totalLivesTouched">
											You have helped support {{ fund?.campaign?.lendingStats?.totalLivesTouched }} {{ fund?.campaign?.category?.name }} entrpeneurs!
										</p>
										<!-- eslint-enable max-len -->
										<p v-else>
											{{ fund?.campaign?.category?.description }}
										</p>

										<div class="tw-flex tw-justify-left tw-gap-4 tw-mt-2 md:tw-self-end">
											<div v-if="fund?.amountDonated">
												<h3>{{ fund?.amountDonated }}</h3>
												<p class="tw-text-small tw-text-gray-500">
													Total fund value
												</p>
											</div>
											<div
												v-if="fund?.campaign?.lendingStats?.totalLivesTouched"
											>
												<h3>{{ fund?.campaign?.lendingStats?.totalLivesTouched }}</h3>
												<p class="tw-text-small tw-text-gray-500">
													People reached
												</p>
											</div>
										</div>
									</div>

									<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-right tw-gap-1.5">
										<KvButton
											:href="`#`"
											target="_blank"
											@click.prevent="handleDonateToFund(fund.id)"
											v-kv-track-event="['giving-funds', 'click', 'Donate']"
										>
											Donate
										</KvButton>
										<KvButton
											:href="`/gf-beta/${fund.id}`"
											target="_blank"
											variant="secondary"
											v-kv-track-event="['giving-funds', 'click', 'View giving fund']"
										>
											View and Edit
										</KvButton>
									</div>
								</div>
							</div>
						</kv-card-frame>
					</div>

					<kv-card-frame
						v-else
						class="tw-mb-2"
					>
						<div class="tw-p-2">
							<p class="tw-text-center tw-text-gray-500">
								You have not created any giving funds yet.
							</p>
						</div>
					</kv-card-frame>
				</div>
			</KvGrid>
		</KvPageContainer>
	</WwwPage>
</template>

<script setup>
import {
	onMounted,
	ref,
	inject,
} from 'vue';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import {
	KvButton,
	KvCardFrame,
	KvGrid,
	KvLoadingPlaceholder,
	KvPageContainer,
	KvTextLink,
} from '@kiva/kv-components';
import logFormatter from '#src/util/logFormatter';
import myGivingFundsQuery from '#src/graphql/query/portfolio/myGivingFunds.graphql';

const apollo = inject('apollo');

const loading = ref(true);
const givingFundsInfo = ref({});
const givingFundsTotalCount = ref(0);
const givingFundsEntries = ref([]);

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

const createNewFund = () => {
	// Handle the logic for creating a new giving fund
	logFormatter('Create a new giving fund', 'info');
};

const handleDonateToFund = fundId => {
	// Handle the logic for donating to a fund
	logFormatter(`Donate to fund with ID: ${fundId}`, 'info');
};

onMounted(() => {
	fetchGivingFundData();
});
</script>
