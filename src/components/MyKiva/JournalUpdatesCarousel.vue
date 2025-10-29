<template>
	<div v-if="updates.length > 0">
		<h3 class="tw-mt-4 tw-mb-2">
			Updates
		</h3>
		<KvCarousel
			class="tw-w-full updates-carousel"
			:key="updates.length"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:slide-max-width="singleSlideWidth"
			:embla-options="{ loop: false, startIndex: carouselIndex }"
			:controls-top-right="controlsTopRight"
			@interact-carousel="interactCarousel"
		>
			<template v-for="(update, index) in updates" #[`slide${index}`] :key="update.id">
				<JournalUpdateCard
					:loan="loan"
					:update="update"
					:update-number="`${totalUpdates - index}`"
					@read-more-clicked="openLightbox"
					@share-loan-clicked="shareLoanClicked"
				/>
			</template>
			<template v-if="!updatesLoading" #view-more>
				<div
					:key="`view-more-card`"
					class="tw-flex tw-items-center tw-h-full tw-pl-4"
				>
					<kv-button
						v-if="showLoadMore"
						class="tw-mt-2 tw-whitespace-nowrap"
						variant="secondary"
						@click="loadMoreUpdates"
					>
						Load more
					</kv-button>
					<kv-button
						v-else
						class="tw-mt-2 tw-whitespace-nowrap"
						variant="secondary"
						:to="'/portfolio'"
						tag="router-link"
					>
						View portfolio
					</kv-button>
				</div>
			</template>
		</KvCarousel>
		<KvLightbox
			:visible="isLightboxVisible"
			title=""
			@lightbox-closed="closeLightbox"
		>
			<CheckoutReceipt
				v-if="receipt"
				:lender="lender"
				:receipt="receipt"
				enable-kiva-card-tracking
				class="tw-pt-2"
			/>
			<template v-else>
				<p>{{ updateSubject }}</p>
				<span v-html="updateBody"></span>
			</template>
		</KvLightbox>
		<ShareButton
			class="tw-block !tw-w-auto"
			:loan="loan"
			variant="hidden"
			:lender="lender"
			:campaign="shareCampaign"
			:in-pfp="inPfp"
			:pfp-min-lenders="pfpMinLenders"
			:num-lenders="numLenders"
			:open-lightbox="shareLoan"
			@lightbox-closed="shareLoan = false"
		/>
	</div>
</template>

<script setup>
import { KvCarousel, KvLightbox, KvButton } from '@kiva/kv-components';
import JournalUpdateCard from '#src/components/MyKiva/JournalUpdateCard';
import ShareButton from '#src/components/BorrowerProfile/ShareButton';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import {
	ref,
	toRefs,
	defineProps,
	inject,
	computed,
	watch,
} from 'vue';
import thanksPageReceiptQuery from '#src/graphql/query/thanksPageReceipt.graphql';
import CheckoutReceipt from '#src/components/Checkout/CheckoutReceipt';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	loan: {
		type: Object,
		default: () => ({}),
	},
	updates: {
		type: Array,
		default: () => ([]),
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	totalUpdates: {
		type: Number,
		default: 0,
	},
	updatesLoading: {
		type: Boolean,
		default: false,
	},
	controlsTopRight: {
		type: Boolean,
		default: false,
	},

});

const cookieStore = inject('cookieStore');
const apollo = inject('apollo');

const { loan, updates, totalUpdates } = toRefs(props);

const emit = defineEmits(['load-more-updates']);

const isLightboxVisible = ref(false);
const clickedUpdate = ref(0);
const updateSubject = ref('');
const updateBody = ref('');
const shareLoan = ref(false);
const carouselIndex = ref(0);
const receipt = ref(null);
let prevUpdatesLength = 3;

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const inPfp = computed(() => loan.value?.inPfp ?? false);

const shareCampaign = computed(() => {
	return inPfp.value ? 'social_share_bp_pfp' : 'social_share_bp';
});

const pfpMinLenders = computed(() => loan.value?.pfpMinLenders ?? 0);

const numLenders = computed(() => loan.value?.lenders?.numLenders ?? 0);

const showLoadMore = computed(() => updates.value?.length < totalUpdates.value);

const singleSlideWidth = computed(() => {
	if (isMobile.value) {
		return '90%';
	}
	return '422px';
});

const getCheckoutReceipt = async () => {
	const update = updates.value.find(u => u.id === clickedUpdate.value);
	const response = await apollo.query({
		query: thanksPageReceiptQuery,
		variables: {
			checkoutId: update.id,
			visitorId: cookieStore.get('uiv') || null,
		}
	});

	receipt.value = response?.data?.shop?.receipt ?? null;
};

const openLightbox = async updateId => {
	clickedUpdate.value = updateId;
	const update = props.updates.find(u => u.id === updateId);
	updateSubject.value = update.subject;
	updateBody.value = update.body;
	if (update?.isTransaction) {
		await getCheckoutReceipt();
	}
	isLightboxVisible.value = true;
};

const closeLightbox = () => {
	isLightboxVisible.value = false;
	receipt.value = null;
	$kvTrackEvent('portfolio', 'click', 'borrower-update-lightbox-closed', clickedUpdate.value);
};

const shareLoanClicked = () => {
	shareLoan.value = true;
	$kvTrackEvent('portfolio', 'click', 'borrower-update-share', clickedUpdate.value);
};

const interactCarousel = () => {
	$kvTrackEvent('portfolio', 'click', 'update-carousel');
};

const loadMoreUpdates = () => {
	$kvTrackEvent('portfolio', 'click', 'borrower-update-load-more');
	emit('load-more-updates');
};

watch(
	() => updates,
	newUpdates => {
		if (newUpdates.value.length) {
			$kvTrackEvent('portfolio', 'view', 'At least one journal update viewed');
		}

		if (prevUpdatesLength > 0 && prevUpdatesLength !== newUpdates.value?.length) {
			carouselIndex.value = prevUpdatesLength - 1;
		}

		prevUpdatesLength = newUpdates.value?.length ?? 0;
	},
	{ deep: true },
);
</script>

<style lang="postcss" scoped>
.updates-carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden md:tw-flex tw-justify-start tw-mt-2;
}

.updates-carousel :deep(.kv-carousel__controls) div {
	@apply tw-invisible tw-mx-0 tw-w-2;
}

.updates-carousel :deep(div:first-child) {
	@apply tw-gap-2;
}
</style>
