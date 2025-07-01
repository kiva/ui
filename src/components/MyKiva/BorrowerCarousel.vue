<template>
	<div>
		<h3
			v-if="hasActiveLoans"
			v-html="title"
			class="tw-mb-2"
		></h3>
		<div v-if="hasActiveLoans" class="tw-relative">
			<KvTabs
				v-if="filteredLoans.length > 1 && showCarouselTabs"
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
		<KvSideSheet
			:kv-track-function="$kvTrackEvent"
			:show-back-button="false"
			:show-go-to-link="true"
			:show-headline-border="true"
			:visible="showSideSheet"
			:width-dimensions="{ default: '100%', xl:'600px', lg: '50%', md:'50%', sm: '100%' }"
			@go-to-link="goToLink"
			@side-sheet-closed="handleCloseSideSheet"
		>
			<BorrowerSideSheetContent
				:loan-id="selectedLoan?.id"
				:is-adding="isAdding"
				:basket-items="basketItems"
				@add-to-basket="addToBasket"
			/>
		</KvSideSheet>
	</div>
</template>

<script setup>
import _throttle from 'lodash/throttle';
import { useRouter } from 'vue-router';
import {
	KvTabs, KvTab, KvTabPanel, KvCarousel, KvButton, KvSideSheet
} from '@kiva/kv-components';
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
import BorrowerSideSheetContent from '#src/components/BorrowerProfile/BorrowerSideSheetContent';
import loanCardBasketed from '#src/graphql/query/loanCardBasketed.graphql';
import { handleInvalidBasket, hasBasketExpired } from '#src/util/basketUtils';
import updateLoanReservation from '#src/graphql/mutation/updateLoanReservation.graphql';
import numeral from 'numeral';
import useTipMessage from '#src/composables/useTipMessage';
import * as Sentry from '@sentry/vue';
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
	showCarouselTabs: {
		type: Boolean,
		default: false,
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');
const apollo = inject('apollo');
const cookieStore = inject('cookieStore');

const { $showTipMsg } = useTipMessage(apollo);

const router = useRouter();

const { loans, totalLoans } = toRefs(props);
const tabs = ref(null);
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

const showSideSheet = ref(false);
const selectedLoan = ref(undefined);
const isAdding = ref(false);
const basketItems = ref([]);

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
		return 'You’re <u>changing a life</u> right now!';
	}
	return `You’re <u>changing ${activeLoans.value.length} lives</u> right now!`;
});

const filteredLoans = computed(() => {
	return loans.value.filter(loan => VALID_LOAN_STATUS
		.includes(loan?.status)).slice(0, props.cardsNumber);
});

const inPfp = computed(() => sharedLoan.value?.inPfp ?? false);

const pfpMinLenders = computed(() => sharedLoan.value?.pfpMinLenders ?? 0);

const numLenders = computed(() => sharedLoan.value?.lenders?.numLenders ?? 0);

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

const goToLink = () => {
	$kvTrackEvent('borrower-profile', 'go-to-old-bp', undefined, `${this.selectedLoan?.id}`);
	window.open(`lend/${this.selectedLoan?.id}`);
};

const handleCloseSideSheet = () => {
	showSideSheet.value = false;
	selectedLoan.value = undefined;
};

const addToBasket = lendAmount => {
	$kvTrackEvent(
		'Lending',
		'Add to basket',
		'lend-button-click',
		selectedLoan.value?.id,
		lendAmount
	);
	isAdding.value = true;
	apollo.mutate({
		mutation: updateLoanReservation,
		variables: {
			loanId: Number(selectedLoan.value?.id),
			price: numeral(lendAmount).format('0.00'),
		},
	}).then(({ errors }) => {
		if (errors) {
			// Handle errors from adding to basket
			errors.forEach(error => {
				try {
					$kvTrackEvent(
						'Lending',
						'Add-to-Basket',
						`Failed: ${error.message.substring(0, 40)}...`
					);
					Sentry.captureMessage(`Add to Basket: ${error.message}`);
					if (hasBasketExpired(error?.extensions?.code)) {
						// eslint-disable-next-line max-len
						$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
						return handleInvalidBasket({
							cookieStore,
							loan: {
								id: selectedLoan.value?.id,
								price: lendAmount
							}
						});
					}
					$showTipMsg(error.message, 'error');
				} catch (e) {
					// no-op
				}
			});
		} else {
			try {
				// track facebook add to basket
				if (typeof window !== 'undefined' && typeof fbq === 'function') {
					window.fbq('track', 'AddToCart', { content_category: 'Loan' });
				}
			} catch (e) {
				console.error(e);
			}
			const basketId = cookieStore.get('kvbskt');
			return apollo.query({
				query: loanCardBasketed,
				variables: {
					id: selectedLoan.value?.id,
					basketId: basketId || undefined
				},
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				basketItems.value = data?.shop?.basket?.items?.values || [];
			});
		}
	}).catch(error => {
		$showTipMsg('Failed to add loan. Please try again.', 'error');
		$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
		Sentry.captureException(error);
	}).finally(() => {
		isAdding.value = false;
	});
};

const showLoanDetails = payload => {
	selectedLoan.value = payload?.loan ?? null;
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
