<template>
	<div>
		<h3
			v-if="hasActiveLoans"
			v-html="title"
			class="tw-mt-4 tw-mb-2"
		></h3>
		<div v-if="hasActiveLoans" class="tw-relative">
			<KvTabs
				v-show="filteredLoans.length > 1 && showCarouselTabs"
				ref="tabs"
				class="tabs"
				@tab-changed="handleChange"
			>
				<template #tabNav>
					<KvTab
						v-for="(loan, index) in filteredLoans"
						:key="index"
						:label="index + 1"
						:for-panel="`${loan.id}`"
					>
						<div class="tw-flex tw-flex-col tw-justify-start tw-items-center tw-w-10">
							<div
								class="tw-w-8 tw-h-8 tw-mx-auto md:tw-mx-0 tw-border-white tw-border-4
									tw-rounded-full tw-shadow"
							>
								<BorrowerImage
									class="tw-w-full tw-rounded-full"
									:alt="getBorrowerName(loan)"
									:aspect-ratio="1"
									:default-image="{ width: 80, faceZoom: 50 }"
									:hash="getBorrowerHash(loan)"
									:images="[
										{ width: 80, faceZoom: 50, viewSize: 1024 },
										{ width: 72, faceZoom: 50, viewSize: 734 },
										{ width: 64, faceZoom: 50 },
									]"
								/>
							</div>
							<h5 class="tw-text-center tw-text-ellipsis tw-line-clamp-2 tw-whitespace-normal tw-pt-0.5">
								{{ getBorrowerName(loan) }}
							</h5>
						</div>
					</KvTab>
				</template>
				<template #tabPanels>
					<KvTabPanel
						v-for="(loan, index) in filteredLoans"
						:key="index"
						:id="`${loan.id}`"
					>
						<p class="tw-hidden" :id="loan.id"></p>
					</KvTabPanel>
				</template>
			</KvTabs>
			<div class="carousel-container">
				<KvCarousel
					ref="carousel"
					class="borrower-carousel tw-w-full tw-overflow-visible"
					:multiple-slides-visible="true"
					:slide-max-width="'336px'"
					:embla-options="{ loop: false, align: 'center'}"
					@change="onInteractCarousel"
				>
					<template v-for="(loan, index) in filteredLoans" #[`slide${index+1}`] :key="loan.id || index">
						<BorrowerStatusCard
							:loan="loan" class="tw-h-full"
							:open-what-is-next="openWhatIsNext"
							:show-menu="showMenu"
							@toggle-what-is-next="openWhatIsNext = $event"
							@open-comment-modal="openCommentModal"
							@open-share-modal="openShareModal"
							@open-side-sheet="showLoanDetails"
						/>
					</template>
					<template v-if="totalLoans > filteredLoans.length" #see-all>
						<div
							:key="`view-more-card`"
							class="tw-flex tw-items-center tw-h-full tw-pl-4"
						>
							<kv-button
								class="tw-mt-2 tw-whitespace-nowrap"
								variant="secondary"
								@click="loadMore"
							>
								See all
							</kv-button>
						</div>
					</template>
				</KvCarousel>
			</div>
		</div>
		<!-- Loan Comment Component -->
		<LoanCommentModal
			:loan="selectedLoan"
			:is-visible="isVisible"
			@comment-modal-closed="handleCloseCommentModal"
		/>
		<!-- Share Button -->
		<ShareButton
			v-if="sharedLoan"
			class="tw-block !tw-w-auto"
			:loan="sharedLoan"
			variant="hidden"
			:lender="lender"
			:campaign="SHARE_CAMPAIGN"
			:in-pfp="inPfp"
			:pfp-min-lenders="pfpMinLenders"
			:num-lenders="numLenders"
			:open-lightbox="shareLoan"
			:is-portfolio="true"
			@lightbox-closed="closeShareModal"
		/>
		<BorrowerSideSheetWrapper
			:basket-items="basketItems"
			:disable-cash="disableCache"
			:is-adding="isAdding"
			:kv-track-function="$kvTrackEvent"
			:selected-loan-id="selectedLoan?.id"
			:show-next-steps="true"
			:show-side-sheet="showSideSheet"
			@add-to-basket="addToBasket"
			@go-to-link="goToLink"
			@close-side-sheet="handleCloseSideSheet"
		/>
	</div>
</template>

<script setup>
import _throttle from 'lodash/throttle';
import { useRouter } from 'vue-router';
import {
	KvTabs, KvTab, KvTabPanel, KvCarousel, KvButton
} from '@kiva/kv-components';
import {
	computed,
	defineEmits,
	defineProps,
	inject,
	onBeforeUnmount,
	onMounted,
	ref,
	toRefs,
	watch,
} from 'vue';
import {
	PAYING_BACK,
	FUNDED,
	FUNDRAISING,
	RAISED,
	EXPIRED,
	REFUNDED,
	ENDED,
} from '#src/api/fixtures/LoanStatusEnum';
import LoanCommentModal from '#src/pages/Portfolio/ImpactDashboard/LoanCommentModal';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import BorrowerSideSheetWrapper from '#src/components/BorrowerProfile/BorrowerSideSheetWrapper';
import BorrowerStatusCard from './BorrowerStatusCard';

const SHARE_CAMPAIGN = 'social_share_portfolio';

const emit = defineEmits([
	'add-to-basket',
	'go-to-link',
	'handle-selected-loan'
]);

const props = defineProps({
	/**
	 * Array of loans
	 */
	loans: {
		type: Array,
		default: () => ([]),
		required: true,
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	showMenu: {
		type: Boolean,
		default: false,
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	cardsNumber: {
		type: Number,
		default: 9,
	},
	showCarouselTabs: {
		type: Boolean,
		default: false,
	},
	basketItems: {
		type: Array,
		default: () => []
	},
	isAdding: {
		type: Boolean,
		default: false
	},
	selectedLoan: {
		type: Object,
		default: () => ({})
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

const router = useRouter();

const { loans, totalLoans } = toRefs(props);

const carousel = ref(null);
const disableCache = ref(false);
const isVisible = ref(false);
const lastVisitedLoanIdx = ref(0);
const openWhatIsNext = ref(false);
const previousLastIndex = ref(0);
const sharedLoan = ref(null);
const shareLoan = ref(false);
const showSideSheet = ref(false);
const tabs = ref(null);
const windowWidth = ref(0);

const VALID_LOAN_STATUS = [
	FUNDED,
	FUNDRAISING,
	PAYING_BACK,
	RAISED,
	EXPIRED,
	REFUNDED,
	ENDED,
];

const activeLoans = computed(() => {
	return loans.value.filter(l => VALID_LOAN_STATUS.includes(l?.status));
});

const hasActiveLoans = computed(() => activeLoans.value.length > 0);

const title = computed(() => {
	if (totalLoans.value === 1) {
		return 'You’re <u>changing a life</u>!';
	}
	return `You’re <u>changing ${totalLoans.value} lives</u>!`;
});

const filteredLoans = computed(() => {
	return loans.value.filter(loan => VALID_LOAN_STATUS
		.includes(loan?.status)).slice(0, props.cardsNumber);
});

const inPfp = computed(() => sharedLoan.value?.inPfp ?? false);

const pfpMinLenders = computed(() => sharedLoan.value?.pfpMinLenders ?? 0);

const numLenders = computed(() => sharedLoan.value?.lenders?.numLenders ?? 0);

const addToBasket = payload => {
	emit('add-to-basket', payload);
};

const goToLink = () => {
	emit('go-to-link');
};

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

const throttledResize = _throttle(handleResize, 200);

const onInteractCarousel = interaction => {
	if (previousLastIndex.value === lastVisitedLoanIdx.value) {
		$kvTrackEvent('portfolio', 'click', 'borrower-card-carousel');
	}
	tabs.value.tabContext.selectedIndex = interaction.value;
};

const openCommentModal = payload => {
	emit('handle-selected-loan', payload?.loan ?? null);
	isVisible.value = true;
};

const openShareModal = payload => {
	sharedLoan.value = payload?.loan ?? null;
	shareLoan.value = true;
};

const closeShareModal = () => {
	shareLoan.value = false;
	sharedLoan.value = null;
};

const handleCloseCommentModal = () => {
	isVisible.value = false;
	showSideSheet.value = true;
	disableCache.value = true;
};

const getBorrowerName = loan => {
	return loan?.name ?? '';
};

const getBorrowerHash = loan => {
	return loan?.image?.hash ?? '';
};

const handleChange = event => {
	previousLastIndex.value = lastVisitedLoanIdx.value;
	if (lastVisitedLoanIdx.value !== event) {
		$kvTrackEvent('portfolio', 'click', 'borrower-tab-toggle');
	}
	if (event < filteredLoans.value.length) {
		carousel.value.goToSlide(event);
		lastVisitedLoanIdx.value = event;
	} else {
		tabs.value.tabContext.selectedIndex = lastVisitedLoanIdx.value;
	}
};

const loadMore = () => {
	$kvTrackEvent('portfolio', 'click', 'view-all');
	router.push('/portfolio/loans');
};

const handleCloseSideSheet = () => {
	emit('handle-selected-loan', undefined);
	showSideSheet.value = false;
	disableCache.value = false;
};

const showLoanDetails = payload => {
	emit('handle-selected-loan', payload?.loan);
	showSideSheet.value = true;
};

watch(() => loans.value, () => {
	if (hasActiveLoans.value) {
		$kvTrackEvent('portfolio', 'view', 'Active borrowers', filteredLoans.value.length);
	}
}, { immediate: true });

onMounted(() => {
	window.addEventListener('resize', throttledResize);
	handleResize();
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', throttledResize);
});

</script>

<style lang="postcss" scoped>
.carousel-container :deep(section > div:first-child) {
	max-width: 100%;
}

.borrower-carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex tw-justify-start tw-mt-2;
}

.borrower-carousel :deep(.kv-carousel__controls) div {
	@apply tw-invisible tw-mx-0 tw-w-2;
}

.borrower-carousel :deep(div:first-child) {
	@apply tw-gap-2;
}

:deep(.tabs) div[role=tablist] {
	@apply md:tw-gap-3.5 tw-items-baseline;
}
</style>
