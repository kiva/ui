<template>
	<div v-if="updates.length > 0" class="tw-my-3">
		<h3 class="tw-my-2">
			Updates
		</h3>
		<KvCarousel
			class="tw-w-full updates-carousel md:tw-overflow-visible"
			:key="updates.length"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:embla-options="{ loop: false, startIndex: carouselIndex }"
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
			<template v-if="showLoadMore" #view-more>
				<div
					:key="`view-more-card`"
					class="tw-flex tw-items-center tw-h-full tw-pr-3"
				>
					<kv-button
						class="tw-mt-2"
						variant="secondary"
						@click="loadMoreUpdates"
					>
						Load more<br>updates
					</kv-button>
				</div>
			</template>
		</KvCarousel>
		<KvLightbox
			:visible="isLightboxVisible"
			title=""
			@lightbox-closed="closeLightbox"
		>
			<p>{{ updateSubject }}</p>
			<span v-html="updateBody"></span>
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
import {
	ref,
	toRefs,
	defineProps,
	inject,
	computed,
	watch,
} from 'vue';

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
});

const { loan, updates, totalUpdates } = toRefs(props);

const emit = defineEmits(['load-more-updates']);

const isLightboxVisible = ref(false);
const clickedUpdate = ref(0);
const updateSubject = ref('');
const updateBody = ref('');
const shareLoan = ref(false);
const carouselIndex = ref(0);

const inPfp = computed(() => loan.value?.inPfp ?? false);

const shareCampaign = computed(() => {
	return inPfp.value ? 'social_share_bp_pfp' : 'social_share_bp';
});

const pfpMinLenders = computed(() => loan.value?.pfpMinLenders ?? 0);

const numLenders = computed(() => loan.value?.lenders?.numLenders ?? 0);

const showLoadMore = computed(() => updates.value?.length < totalUpdates.value);

const openLightbox = updateId => {
	clickedUpdate.value = updateId;
	const update = props.updates.find(u => u.id === updateId);
	updateSubject.value = update.subject;
	updateBody.value = update.body;
	isLightboxVisible.value = true;
};

const closeLightbox = () => {
	isLightboxVisible.value = false;
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
	() => {
		if (updates.value.length > 0 && updates.value.length < 3) {
			$kvTrackEvent('portfolio', 'view', 'At least one journal update viewed');
			carouselIndex.value = 0;
		}
		if (updates.value.length > 3) {
			carouselIndex.value = updates.value.length - 2;
		}
	},
	{ deep: true },
);
</script>

<style lang="postcss" scoped>
.updates-carousel :deep(.kv-carousel__controls) {
	@apply tw-justify-start;
}

.updates-carousel :deep(.kv-carousel__controls) div {
	@apply tw-invisible tw-mx-0;
}
</style>
