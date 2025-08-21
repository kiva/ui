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
								<div class="tw-flex tw-justify-between">
									<div>
										<!--  eslint-disable max-len -->
										<div
											v-if="fund?.goals?.values?.filter(goal => goal?.status === 'IN_PROGRESS')?.length"
											class="
												tw-flex tw-items-center tw-gap-1
												tw-mb-2 tw-rounded tw-bg-gray-100
												tw-px-1.5
											"
										>
											<kv-pulsing-dot />
											<span
												class="tw-text-small tw-font-medium"
												style="height: 30px; line-height: 32px;"
											>
												Active Fundraiser
											</span>
										</div>
										<!-- eslint-enable max-len -->
										<h2 class="tw-mb-1">
											{{ fund?.campaign?.category?.name }}
										</h2>
										<!--  eslint-disable max-len -->
										<p v-if="fund?.campaign?.lendingStats?.totalLivesTouched">
											This fund has helped {{ fund?.campaign?.lendingStats?.totalLivesTouched }} people to date
										</p>
										<!-- eslint-enable max-len -->
										<p v-else>
											{{ fund?.campaign?.category?.description }}
										</p>
									</div>

									<div class="tw-flex tw-flex-col md:tw-flex-row tw-justify-right tw-gap-1.5">
										<KvButton
											v-if="!isMobile"
											:href="`/gf-beta/${fund.id}?action=donate`"
											target="_blank"
											variant="secondary"
											v-kv-track-event="['giving-funds', 'click', 'Donate']"
										>
											Donate
										</KvButton>
										<kv-utility-menu
											analytics-category="giving-funds"
											menu-position="right-aligned"
											button-radius-class="tw-rounded"
											button-size="medium"
											button-border-class="tw-border tw-border-primary"
										>
											<ul>
												<li class="tw-border-b tw-border-gray-100">
													<a
														class="
															utility-menu-link
															tw-rounded-t
														"
														:href="`/gf-beta/${fund.id}`"
														target="_blank"
														v-kv-track-event="['giving-funds', 'click', 'View giving fund']"
													>
														View giving fund
													</a>
												</li>
												<li class="tw-border-b tw-border-gray-100">
													<a
														class="
															utility-menu-link
														"
														:href="`/gf-beta/${fund.id}?action=edit`"
														target="_blank"
														v-kv-track-event="['giving-funds', 'click', 'Edit fund']"
													>
														Edit fund
													</a>
												</li>
												<li class="tw-border-b tw-border-gray-100">
													<a
														class="
															utility-menu-link
															tw-rounded-b
														"
														:href="`/gf-beta/${fund.id}?action=share`"
														target="_blank"
														v-kv-track-event="['giving-funds', 'click', 'Share fund']"
													>
														Share fund
													</a>
												</li>
											</ul>
										</kv-utility-menu>
									</div>
								</div>

								<div
									v-if="fund?.currentAmountDonated > 0"
									class="tw-flex tw-gap-3 tw-mt-3 tw-flex-wrap"
								>
									<div v-if="fund?.currentAmountDonated">
										<h2>{{ numeral(fund?.currentAmountDonated).format('$0,0') }}</h2>
										<p class="tw-text-small tw-text-gray-500">
											Your donations
										</p>
									</div>
									<div v-if="fund?.currentAmountDonated">
										<h2>{{ numeral(fund?.currentAmountDonated).format('$0,0') }}</h2>
										<p class="tw-text-small tw-text-gray-500">
											Total donations
										</p>
									</div>
									<div v-if="fund?.campaign?.lendingStats?.totalLent">
										<h2>
											{{ numeral(fund?.campaign?.lendingStats?.totalLent).format('$0,0') }}
										</h2>
										<p class="tw-text-small tw-text-gray-500">
											Total fund impact
										</p>
									</div>
									<div v-if="fund?.totalParticipants">
										<h2>{{ fund?.totalParticipants }}</h2>
										<p class="tw-text-small tw-text-gray-500">
											Participants
										</p>
									</div>
								</div>

								<KvButton
									class="tw-w-full tw-mt-3"
									:href="`/gf-beta/${fund.id}?action=start-fundraiser`"
									target="_blank"
									variant="secondary"
									v-kv-track-event="['giving-funds', 'click', 'Start a fundraiser', fund.id]"
								>
									+ Start a fundraiser and invite others to join
								</KvButton>
								<KvButton
									v-if="isMobile"
									class="tw-w-full tw-mt-2"
									:href="`/gf-beta/${fund.id}?action=donate`"
									target="_blank"
									variant="secondary"
									v-kv-track-event="['giving-funds', 'click', 'Donate']"
								>
									Donate
								</KvButton>
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
	KvPulsingDot,
	KvUtilityMenu,
} from '@kiva/kv-components';
import useIsMobile from '#src/composables/useIsMobile';
import logFormatter from '#src/util/logFormatter';
import numeral from 'numeral';
import myGivingFundsQuery from '#src/graphql/query/portfolio/myGivingFunds.graphql';

const apollo = inject('apollo');
const { isMobile } = useIsMobile();

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

onMounted(() => {
	fetchGivingFundData();
});
</script>

<style lang="postcss" scoped>
.utility-menu-link {
	@apply tw-block tw-p-1.5 hover:tw-bg-secondary tw-text-primary hover:tw-text-action-highlight tw-font-medium;
	@apply tw-no-underline active:tw-no-underline;
	@apply visited:tw-no-underline hover:tw-no-underline focus:tw-no-underline;
}
</style>
