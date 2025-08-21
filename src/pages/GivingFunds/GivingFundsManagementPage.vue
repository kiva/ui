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
							@click.prevent="isCreateFundLightboxVisible = true"
							v-kv-track-event="['giving-funds', 'click', 'Start a new fund']"
						>
							Start a new fund
						</kv-button>
						<kv-lightbox
							:visible="isCreateFundLightboxVisible"
							title="Choose your impact area"
							@lightbox-closed="isCreateFundLightboxVisible = false"
						>
							<p class="tw-pb-2">
								Select the cause you want to support with your fund.
							</p>
							<kv-impact-vertical-selector
								:category-list="givingFundCategories"
								:hidden-categories="usersGivingFundCategoryIds"
								@category-selected="selectedCategoryId = $event"
							/>
							<template #controls>
								<kv-button
									:state="selectedCategoryId ? '' : 'disabled'"
									variant="primary"
									@click.prevent="createNewFund"
									v-kv-track-event="['giving-funds', 'click', 'Continue (created fund submit)']"
								>
									Continue
								</kv-button>
							</template>
						</kv-lightbox>
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
										<kv-pill
											v-if="fund?.goals?.values?.filter(goal => goal?.status === 'IN_PROGRESS')?.length"
											bg-class="tw-bg-gray-100"
											rounded-class="tw-rounded-full"
										>
											<template #icon>
												<kv-pulsing-dot />
											</template>
											Active Fundraiser
										</kv-pill>
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
	computed,
	onMounted,
	ref,
	inject,
} from 'vue';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import {
	KvButton,
	KvCardFrame,
	KvGrid,
	KvImpactVerticalSelector,
	KvLightbox,
	KvLoadingPlaceholder,
	KvPageContainer,
	KvPill,
	KvPulsingDot,
	KvUtilityMenu,
} from '@kiva/kv-components';
import { addGivingFund } from '@kiva/kv-shop';
import useIsMobile from '#src/composables/useIsMobile';
import logFormatter from '#src/util/logFormatter';
import numeral from 'numeral';
import loanCategories from '#src/graphql/query/loanCategories.graphql';
import myGivingFundsQuery from '#src/graphql/query/portfolio/myGivingFunds.graphql';
import userIdQuery from '#src/graphql/query/userId.graphql';

const apollo = inject('apollo');
const { isMobile } = useIsMobile();

const loading = ref(true);
const givingFundsInfo = ref({});
const givingFundsTotalCount = ref(0);
const givingFundsEntries = ref([]);
const isCreateFundLightboxVisible = ref(false);
const givingFundCategories = ref([]);
const selectedCategoryId = ref(null);
const userId = ref(null);

// List of category ids already present on the user's giving funds, used to exclude options for new fund creation
const usersGivingFundCategoryIds = computed(() => {
	return givingFundsEntries.value.map(fund => fund?.campaign?.category?.id);
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

/**
 * Map a category ID to a fund target.
 * CLIMATE_IMPACTED, EDUCATION, FINANCIAL_INCLUSION, MARGINALIZED_US, REFUGEES, WOMEN
 * NOTE: These are also hard-coded in MLCS
 */
const getFundTargetFromCategoryId = categoryId => {
	if (!categoryId) return null;
	switch (categoryId) {
		case '28fe587c-f6f4-4329-b4ed-ac094b2c14b3':
			return 'CLIMATE_IMPACTED';
		case '486bca95-7425-42ee-baf7-960eef7b3d0c':
			return 'REFUGEES';
		case '914823b9-b4e3-4980-8811-09dbe0f19860':
			return 'EDUCATION';
		case '87ec8472-5cd7-49a7-a565-3f0b03e42a32':
			return 'MARGINALIZED_US';
		case '8ace83f1-e02d-404d-a3c4-83fa0be69403':
			return 'WOMEN';
		case 'f36abd3e-a304-4948-9378-b697b775ec2b':
		default:
			return 'FINANCIAL_INCLUSION';
	}
};

const createGivingFund = async categoryId => {
	try {
		await addGivingFund({
			apollo,
			fundTarget: getFundTargetFromCategoryId(categoryId),
			userId: userId.value,
		});
		logFormatter('Giving fund created successfully', 'success');
	} catch (error) {
		logFormatter(`Error creating giving fund: ${error}`, 'error');
	}
};

const fetchGivingFundLoanCategories = async () => {
	try {
		const response = await apollo.query({
			query: loanCategories,
			variables: {
				filters: {
					type: 'GIVING_FUND',
				},
			},
		});
		givingFundCategories.value = response?.data?.categories.values;
	} catch (error) {
		logFormatter(`Error fetching giving fund loan categories: ${error}`, 'error');
	}
};

const createNewFund = async () => {
	if (!selectedCategoryId.value) {
		logFormatter('No category selected for new giving fund', 'error');
		// show a tip message
		return;
	}
	await createGivingFund(selectedCategoryId?.value);
	fetchGivingFundData();
	isCreateFundLightboxVisible.value = false;
};

const fetchUserId = async () => {
	try {
		const response = await apollo.query({
			query: userIdQuery,
		});
		userId.value = response?.data?.my?.id;
	} catch (error) {
		logFormatter(`Error fetching userId: ${error}`, 'error');
	}
};

onMounted(() => {
	fetchGivingFundData();
	fetchGivingFundLoanCategories();
	fetchUserId();
});
</script>

<style lang="postcss" scoped>
.utility-menu-link {
	@apply tw-block tw-p-1.5 hover:tw-bg-secondary tw-text-primary hover:tw-text-action-highlight tw-font-medium;
	@apply tw-no-underline active:tw-no-underline;
	@apply visited:tw-no-underline hover:tw-no-underline focus:tw-no-underline;
}
</style>
