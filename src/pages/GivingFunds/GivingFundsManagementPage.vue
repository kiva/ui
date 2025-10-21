<template>
	<WwwPage main-class="tw-bg-secondary tw-pb-5">
		<KvPageContainer>
			<KvGrid class="tw-grid-cols-12 md:tw-mx-0">
				<div class="tw-col-span-12 tw-pt-1.5 md:tw-pt-3">
					<div class="tw-py-2 md:tw-py-3 tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
						<div>
							<h1 class="tw-mb-1 tw-break-words">
								Your giving funds
							</h1>
							<p class="tw-mb-1 md:tw-mb-0">
								Start a fund, support a cause, and invite others to join.
							</p>
						</div>
						<kv-button
							v-if="givingFundsEntries?.length"
							variant="primary"
							:href="`#`"
							@click.prevent="openCreateFundLightbox"
							v-kv-track-event="['giving-funds', 'click', 'Create a new fund']"
						>
							Create a new fund
						</kv-button>
						<!-- eslint-disable max-len -->
						<kv-lightbox
							:visible="isCreateFundLightboxVisible"
							:title="hasAllFundTypes ? 'You already have funds for all available causes!' : 'Choose your impact area'"
							@lightbox-closed="closeCreateFundLightbox"
						>
							<!-- eslint-enable max-len -->
							<p
								v-if="!hasAllFundTypes"
								class="tw-pb-2"
							>
								Select the cause you want your fund to support.
							</p>
							<p v-else class="tw-text-center">
								<!-- eslint-disable-next-line max-len -->
								You can boost your impact by donating more to an existing fund or setting a new fundraising goal. Please contact support if you would like to create another fund.
							</p>
							<kv-impact-vertical-selector
								v-if="!creatingFund && !hasAllFundTypes"
								:category-list="orderedGivingFundCategories"
								:hidden-categories="usersGivingFundCategoryIds"
								@category-selected="selectImpactArea($event)"
							/>
							<div
								v-else-if="creatingFund && !hasAllFundTypes"
								class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-2"
							>
								<kv-loading-spinner size="medium" />
								<p class="tw-pt-2">
									Creating your new fund...
								</p>
							</div>
							<template #controls>
								<kv-button
									v-if="!creatingFund"
									:state="selectedCategoryId ? '' : 'disabled'"
									variant="primary"
									@click.prevent="createNewFund"
									v-kv-track-event="['giving-funds', 'submit', 'create-new-fund', selectedCategoryId]"
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
						<management-card
							v-for="(fund, i) in givingFundsEntries"
							class="tw-mb-2"
							:key="`management-card-${i}`"
							:fund="fund"
						/>
					</div>

					<kv-card-frame
						v-else
						class="tw-mb-2"
					>
						<div class="tw-flex tw-flex-col tw-items-center tw-text-center tw-p-4">
							<h2
								class="tw-mb-4"
							>
								<!-- eslint-disable-next-line -->
								Start a new fund and invite others<br class="tw-hidden md:tw-inline"> to support your cause.
							</h2>

							<kv-button
								variant="primary"
								:href="`#`"
								@click.prevent="isCreateFundLightboxVisible = true"
								v-kv-track-event="['giving-funds', 'click', 'Create a new fund']"
							>
								Create a new fund
							</kv-button>
						</div>
					</kv-card-frame>

					<div v-if="contributedFundIds.length" class="tw-mt-4">
						<div>
							<h1 class="tw-mb-1 tw-break-words">
								Giving funds you joined
							</h1>
							<p class="tw-mb-3">
								Support other people’s funds and see your collective impact grow.
							</p>
						</div>

						<kv-loading-placeholder
							v-if="loadingContributedFunds"
							class="tw-rounded tw-mb-2 tw-w-full" :style="{ height: '150px' }"
						/>

						<div
							v-else-if="contributedFundsEntries?.length"
						>
							<management-card
								v-for="(fund, i) in contributedFundsEntries"
								class="tw-mb-2"
								:hide-onwer-operations="true"
								:key="`management-card-${i}`"
								:fund="fund"
							/>
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
import ManagementCard from '#src/components/GivingFunds/ManagementCard';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import {
	KvButton,
	KvCardFrame,
	KvGrid,
	KvImpactVerticalSelector,
	KvLightbox,
	KvLoadingPlaceholder,
	KvLoadingSpinner,
	KvPageContainer,
} from '@kiva/kv-components';
import { addGivingFund } from '@kiva/kv-shop';
import logFormatter from '#src/util/logFormatter';
import useGivingFund from '#src/composables/useGivingFund';
import loanCategories from '#src/graphql/query/loanCategories.graphql';
import myGivingFundsQuery from '#src/graphql/query/portfolio/myGivingFunds.graphql';
import userIdQuery from '#src/graphql/query/userId.graphql';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const {
	getDedupedFundsContributedToEntries,
	getFundsContributedToIds,
} = useGivingFund(apollo);

const loading = ref(true);
const loadingContributedFunds = ref(true);
const contributedFundIds = ref([]);
const contributedFundsEntries = ref([]);
const givingFundsInfo = ref({});
const givingFundsTotalCount = ref(0);
const givingFundsEntries = ref([]);
const myGivingFundsEntryIds = ref([]);
const isCreateFundLightboxVisible = ref(false);
const givingFundCategories = ref([]);
const givingFundRootPath = ref('/gf');
const creatingFund = ref(false);
const selectedCategoryId = ref(null);
const userId = ref(null);

// Computed property to order givingFundCategories by a specific id order
const orderedGivingFundCategoryIds = [
	'f36abd3e-a304-4948-9378-b697b775ec2b',
	'8ace83f1-e02d-404d-a3c4-83fa0be69403',
	'486bca95-7425-42ee-baf7-960eef7b3d0c',
	'28fe587c-f6f4-4329-b4ed-ac094b2c14b3',
	'87ec8472-5cd7-49a7-a565-3f0b03e42a32',
	'914823b9-b4e3-4980-8811-09dbe0f19860',
];
const orderedGivingFundCategories = computed(() => {
	// Defensive: if categories not loaded, return empty array
	if (!Array.isArray(givingFundCategories.value)) return [];
	// Sort by the order in orderedGivingFundCategoryIds
	return orderedGivingFundCategoryIds
		.map(id => givingFundCategories.value.find(cat => cat.id === id))
		.filter(Boolean);
});

// List of category ids already present on the user's giving funds, used to exclude options for new fund creation
const usersGivingFundCategoryIds = computed(() => {
	return givingFundsEntries.value.map(fund => fund?.campaign?.category?.id);
});

// Computed property to check if user has all fund types
const hasAllFundTypes = computed(() => {
	return orderedGivingFundCategoryIds.every(id => usersGivingFundCategoryIds.value.includes(id));
});

const fetchGivingFundData = async () => {
	try {
		const response = await apollo.query({
			query: myGivingFundsQuery,
			fetchPolicy: 'network-only',
		});
		givingFundsInfo.value = response?.data?.my?.givingFunds;
		givingFundsTotalCount.value = response?.data?.my?.givingFunds?.totalCount;
		givingFundsEntries.value = response?.data?.my?.givingFunds?.values ?? [];
		myGivingFundsEntryIds.value = givingFundsEntries.value.map(fund => fund.id);
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

const openCreateFundLightbox = () => {
	isCreateFundLightboxVisible.value = true;
	$kvTrackEvent(
		'giving-funds',
		'show',
		'impact-selection-modal',
	);
};

const closeCreateFundLightbox = () => {
	isCreateFundLightboxVisible.value = false;
	$kvTrackEvent(
		'giving-funds',
		'hide',
		'impact-selection-modal',
	);
};

const createNewFund = async () => {
	if (!selectedCategoryId.value) {
		logFormatter('No category selected for new giving fund', 'error');
		return;
	}
	try {
		creatingFund.value = true;
		const newFundResponse = await addGivingFund({
			apollo,
			fundTarget: getFundTargetFromCategoryId(selectedCategoryId.value),
			userId: userId.value,
		});
		// open the new fund in a new tab after creation
		if (newFundResponse?.id) {
			$kvTrackEvent(
				'giving-funds',
				'succeed',
				'new-fund-created',
				newFundResponse.id,
			);
			window.open(`${givingFundRootPath.value}/${newFundResponse.id}`, '_blank');
		}
	} catch (error) {
		logFormatter(`Error creating giving fund: ${error}`, 'error');
	}
	fetchGivingFundData();
	creatingFund.value = false;
	closeCreateFundLightbox();
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

const selectImpactArea = categoryId => {
	$kvTrackEvent(
		'giving-funds',
		'click',
		'impact-area-selection',
		categoryId,
	);
	selectedCategoryId.value = categoryId;
};

onMounted(async () => {
	fetchGivingFundData();
	fetchGivingFundLoanCategories();
	await fetchUserId();
	contributedFundIds.value = await getFundsContributedToIds(userId.value);
	if (contributedFundIds.value.length) {
		try {
			// get full giving fund data for each contributed fund id
			contributedFundsEntries.value = await getDedupedFundsContributedToEntries(contributedFundIds.value);
		} catch (error) {
			logFormatter(`Error fetching contributed giving fund data: ${error}`, 'error');
		}
		loadingContributedFunds.value = false;
	}
});
</script>
