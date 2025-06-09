<template>
	<div>
		<h3
			v-html="title"
			class="tw-mb-2"
			:class="{ 'tw-text-center': !filteredLoans.length }"
		></h3>
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
		<div v-if="hasActiveLoans" class="tw-relative">
			<div class="carousel-container">
				<KvCarousel
					ref="carousel"
					class="borrower-carousel tw-w-full tw-overflow-visible"
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
			<div
				v-if="hasCompletedBorrowers"
				class="tw-text-left tw-mt-1 md:tw-text-right md:tw-mt-0 md:tw-absolute md:tw-right-0"
				style="bottom: -0.5rem"
			>
				<KvButton
					to="/portfolio/loans"
					v-kv-track-event="['portfolio', 'click', 'See all borrowers']"
					variant="secondary"
				>
					See all borrowers
				</KvButton>
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
import { KvCarousel, KvButton } from '@kiva/kv-components';
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
	showCtaWhenNoLoans: {
		type: Boolean,
		default: true,
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');

const { loans, totalLoans } = toRefs(props);
const carousel = ref(null);
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
const previousLastIndex = ref(0);

const activeLoans = computed(() => {
	return loans.value.filter(l => [FUNDED, FUNDRAISING, PAYING_BACK, RAISED].includes(l?.status));
});

const hasActiveLoans = computed(() => activeLoans.value.length > 0);

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

const singleSlideWidth = computed(() => {
	const viewportWidth = typeof window !== 'undefined' ? windowWidth.value : 520;

	// Handle small mobile screens
	if (viewportWidth < 450) {
		return '90%';
	}
	if (typeof window !== 'undefined' && window.innerWidth < 1024) {
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

const onInteractCarousel = () => {
	if (previousLastIndex.value === lastVisitedLoanIdx.value) {
		$kvTrackEvent('portfolio', 'click', 'borrower-card-carousel');
	}
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

	@screen md {
		max-width: 468px;
	}

	@screen lg {
		max-width: 520px;
	}
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
</style>
