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
					class="borrower-carousel tw-w-full"
					:class="{ 'tw--mt-6': controlsTopRight }"
					:multiple-slides-visible="true"
					:slide-max-width="singleSlideWidth"
					:embla-options="{ loop: false, align: 'center'}"
					:controls-top-right="controlsTopRight"
					@change="onInteractCarousel"
				>
					<template v-for="(loan, index) in filteredLoans" #[`slide${index+1}`] :key="loan.id || index">
						<BorrowerStatusCard
							class="tw-h-full !tw-w-full"
							:loan="loan"
							:open-what-is-next="openWhatIsNext"
							:show-menu="showMenu"
							@toggle-what-is-next="openWhatIsNext = $event"
							@open-comment-modal="openCommentModal"
							@open-share-modal="openShareModal"
							@open-side-sheet="openSideSheet"
							@mouseenter="$emit('mouse-enter-status-card', loan?.id)"
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
			:loan="loanForMenu"
			:is-visible="isCommentModalVisible"
			:show-tip="false"
			@comment-modal-closed="handleCloseCommentModal"
		/>
		<!-- Share Button -->
		<ShareButton
			v-if="loanForMenu"
			class="tw-block !tw-w-auto"
			variant="hidden"
			:loan="loanForMenu"
			:lender="lender"
			:campaign="SHARE_CAMPAIGN"
			:in-pfp="inPfp"
			:pfp-min-lenders="pfpMinLenders"
			:num-lenders="numLenders"
			:open-lightbox="shareLoan"
			:is-portfolio="true"
			@lightbox-closed="closeShareModal"
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
import useBreakpoints from '#src/composables/useBreakpoints';
import BorrowerStatusCard from './BorrowerStatusCard';

const SHARE_CAMPAIGN = 'social_share_portfolio';

const emit = defineEmits([
	'handle-selected-loan',
	'mouse-enter-status-card'
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
		default: () => ([]),
	},
	isAdding: {
		type: Boolean,
		default: false
	},
	controlsTopRight: {
		type: Boolean,
		default: false
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

const router = useRouter();

const { isMedium, isLarge } = useBreakpoints();

const { loans, totalLoans } = toRefs(props);

const carousel = ref(null);
const isCommentModalVisible = ref(false);
const lastVisitedLoanIdx = ref(0);
const openWhatIsNext = ref(false);
const previousLastIndex = ref(0);
const loanForMenu = ref(undefined);
const shareLoan = ref(false);
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

const inPfp = computed(() => loanForMenu.value?.inPfp ?? false);

const pfpMinLenders = computed(() => loanForMenu.value?.pfpMinLenders ?? 0);

const numLenders = computed(() => loanForMenu.value?.lenders?.numLenders ?? 0);

const singleSlideWidth = computed(() => {
	if (isLarge.value) {
		return 'calc((100% - 32px) / 3)';
	}
	if (isMedium.value) {
		return '336px';
	}
	return '90%';
});

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
	loanForMenu.value = payload?.loan;
	if (loanForMenu.value) {
		isCommentModalVisible.value = true;
	}
};

const openShareModal = payload => {
	loanForMenu.value = payload?.loan;
	if (loanForMenu.value) {
		shareLoan.value = true;
	}
};

const clearLoanAfterDelay = () => {
	setTimeout(() => {
		loanForMenu.value = undefined;
	}, 500); // Delay to allow modal to close before clearing loan
};

const closeShareModal = () => {
	shareLoan.value = false;
	clearLoanAfterDelay();
};

const openSideSheet = payload => {
	emit('handle-selected-loan', { id: payload?.loan?.id });
};

const handleCloseCommentModal = wasCommentAdded => {
	isCommentModalVisible.value = false;
	if (wasCommentAdded) {
		openSideSheet({ loan: { id: loanForMenu.value.id } });
	}
	clearLoanAfterDelay();
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

:deep(.tabs) div[role=tablist] {
	@apply md:tw-gap-3.5 tw-items-baseline;
}
</style>
