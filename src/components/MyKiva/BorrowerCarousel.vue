<template>
	<div>
		<template v-if="isLoading">
			<KvLoadingPlaceholder class="tw-my-2 lg:tw-mb-4 !tw-w-full md:!tw-w-1/2 !tw-h-6" />
			<KvLoadingPlaceholder
				class="tw-mb-2 lg:tw-mb-3 !tw-w-full md:!tw-w-1/2"
				:style="{ height: '17rem' }"
			/>
		</template>
		<template v-else>
			<h2
				v-html="title"
				class="tw-mb-3.5"
				:class="{ 'tw-text-center': !filteredLoans.length }"
			></h2>
			<div :class="{'tw-flex tw-justify-center': !filteredLoans.length }">
				<KvButton
					v-kv-track-event="[
						'portfolio',
						'click',
						btnEventLabel
					]" v-if="showCtaWhenNoLoans && (!filteredLoans.length || !hasActiveLoans)"
					:to="link"
				>
					{{ btnCta }}
				</KvButton>
			</div>
		</template>
		<div v-if="hasActiveLoans && !isLoading">
			<KvTabs ref="tabs" @tab-changed="handleChange" v-if="filteredLoans.length > 1" class="tabs">
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
					<KvTab v-if="totalLoans > filteredLoans.length" for-panel="view-more">
						<a
							href="/portfolio/loans" v-kv-track-event="[
								'portfolio',
								'click',
								'view-all'
							]"
						>View all</a>
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
					class="borrower-carousel tw-w-full md:tw-overflow-visible"
					:multiple-slides-visible="true"
					:slide-max-width="singleSlideWidth"
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
						/>
					</template>
				</KvCarousel>
			</div>
			<div class="tw-text-right" v-if="hasCompletedBorrowers">
				<a
					class="tw-text-h5"
					href="/portfolio/loans" v-kv-track-event="[
						'portfolio',
						'click',
						'See all borrowers'
					]"
				>See all borrowers</a>
			</div>
		</div>
		<!-- Loan Comment Component -->
		<LoanCommentModal
			:loan="commentLoanData"
			@comment-modal-closed="commentLoanData.visible = false"
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
	</div>
</template>

<script setup>
import _throttle from 'lodash/throttle';
import {
	KvTabs, KvTab, KvTabPanel, KvCarousel, KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import {
	defineProps,
	ref,
	computed,
	toRefs,
	inject,
	onMounted,
	onBeforeUnmount,
	watch,
} from 'vue';
import {
	PAYING_BACK,
	ENDED,
	DEFAULTED,
	FUNDED,
	FUNDRAISING,
	RAISED
} from '#src/api/fixtures/LoanStatusEnum';
import LoanCommentModal from '#src/pages/Portfolio/ImpactDashboard/LoanCommentModal';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import BorrowerStatusCard from './BorrowerStatusCard';

const SHARE_CAMPAIGN = 'social_share_portfolio';

const props = defineProps({
	/**
   * Array of loans
   * */
	loans: {
		type: Array,
		default: () => ([]),
		required: true,
	},
	isLoading: {
		type: Boolean,
		default: false,
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
	showCtaWhenNoLoans: {
		type: Boolean,
		default: true,
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

const { loans, totalLoans } = toRefs(props);
const carousel = ref(null);
const tabs = ref(null);
const windowWidth = ref(0);
const openWhatIsNext = ref(false);
const lastVisitedLoanIdx = ref(0);
const sharedLoan = ref(null);
const commentLoanData = ref({
	loanId: 0,
	borrowerName: '',
	visible: false,
});
const shareLoan = ref(false);

const activeLoans = computed(() => {
	return loans.value.filter(l => [FUNDED, FUNDRAISING, PAYING_BACK, RAISED].includes(l?.status));
});

const hasActiveLoans = computed(() => activeLoans.value.length > 0);

const getBorrowerName = loan => {
	return loan?.name ?? '';
};

const getBorrowerHash = loan => {
	return loan?.image?.hash ?? '';
};

const title = computed(() => {
	if (!loans.value.length) {
		return 'Change a life <u>today</u>!';
	}
	if (!hasActiveLoans.value) {
		return `You changed <u>${totalLoans.value} lives</u>!`;
	}

	if (totalLoans.value === 1) {
		return 'You’re <u>changing a life</u> right now!';
	}
	return `You’re <u>changing ${activeLoans.value.length} lives</u> right now!`;
});

const btnCta = computed(() => {
	if (!loans.value.length) {
		return 'Make a loan';
	}

	return 'See previously supported borrowers';
});

const link = computed(() => {
	if (!loans.value.length) {
		return '/lend-by-category';
	}

	return '/portfolio/loans';
});

const btnEventLabel = computed(() => {
	if (!hasActiveLoans.value) {
		return 'see-previously-supported-people';
	}
	return 'Make a loan - no loans state';
});

const filteredLoans = computed(() => {
	return loans.value.filter(loan => [FUNDED, FUNDRAISING, PAYING_BACK, RAISED]
		.includes(loan?.status)).slice(0, props.cardsNumber);
});

const inPfp = computed(() => sharedLoan.value?.inPfp ?? false);

const pfpMinLenders = computed(() => sharedLoan.value?.pfpMinLenders ?? 0);

const numLenders = computed(() => sharedLoan.value?.lenders?.numLenders ?? 0);

const handleChange = event => {
	if (event < filteredLoans.value.length) {
		carousel.value.goToSlide(event);
		lastVisitedLoanIdx.value = event;
	} else {
		tabs.value.tabContext.selectedIndex = lastVisitedLoanIdx.value;
	}
};

const singleSlideWidth = computed(() => {
	const viewportWidth = typeof window !== 'undefined' ? windowWidth.value : 520;

	// Handle small mobile screens
	if (viewportWidth < 450) {
		return '100%';
	}
	if (window.innerWidth < 1024) {
		return '468px';
	}
	return '520px';
});

const hasCompletedBorrowers = computed(() => {
	return loans.value.some(loan => loan?.status === ENDED || loan?.status === DEFAULTED);
});

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

const throttledResize = _throttle(handleResize, 200);

const onInteractCarousel = interaction => {
	tabs.value.tabContext.selectedIndex = interaction.value;
};

const openCommentModal = payload => {
	commentLoanData.value = {
		...payload,
		visible: true
	};
};

const openShareModal = payload => {
	sharedLoan.value = payload?.loan ?? null;
	shareLoan.value = true;
};

const closeShareModal = () => {
	shareLoan.value = false;
	sharedLoan.value = null;
};

watch(() => loans.value, () => {
	if (!hasActiveLoans.value) {
		$kvTrackEvent('portfolio', 'view', 'No active borrowers');
	} else {
		$kvTrackEvent('portfolio', 'view', 'Active borrowers', filteredLoans.value.length);
	}
});

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

	@screen md {
		max-width: 468px;
	}

	@screen lg {
		max-width: 520px;
	}
}

:deep(.tabs) div[role=tablist] {
	@apply md:tw-gap-3.5 tw-items-baseline;
}
</style>
