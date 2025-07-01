<template>
	<div class="tw-rounded tw-bg-white tw-p-2 update-card tw-h-full tw-flex tw-flex-col">
		<div class="tw-flex tw-gap-1">
			<!-- Show triple image for repayment summary cards -->
			<div v-if="update.isRepayment && update.status === 'repayment-summary' && update.repaymentImages">
				<BorrowerImageTriple :images="update.repaymentImages" />
			</div>
			<!-- Show single image for other cards -->
			<div
				v-else
				class="tw-w-6 tw-h-6 lg:tw-w-8 lg:tw-h-8 tw-rounded-full tw-shadow tw-shrink-0"
			>
				<BorrowerImage
					v-if="hash"
					class="tw-w-full tw-rounded-full tw-bg-brand"
					:alt="borrowerName"
					:aspect-ratio="1"
					:default-image="{ width: 80, faceZoom: 50 }"
					:hash="hash"
					:images="[
						{ width: 80, faceZoom: 50, viewSize: 1024 },
						{ width: 72, faceZoom: 50, viewSize: 734 },
						{ width: 64, faceZoom: 50 }
					]"
				/>
				<KvUserAvatar
					v-else
					class="kiva-logo lg:tw-w-8"
				/>
			</div>
			<div class="tw-flex tw-flex-col tw-items-start">
				<p class="tw-mb-0.5 tw-font-medium tw-line-clamp-1">
					{{ update.title || title }}
				</p>
				<div class="tw-py-0.5 tw-px-1 tw-font-medium tw-text-small tw-bg-eco-green-1 tw-rounded tw-w-auto">
					{{ loanStatus }}
				</div>
			</div>
		</div>
		<div class="tw-my-1">
			<p>{{ subjectLine }}</p>
			<!-- Show full body for repayment cards, truncated for others -->
			<span v-html="update.isRepayment ? body : truncatedBody"></span>
			<!-- Show "Use your funds" for repayment cards, "read more" for others -->
			<button
				v-if="update.isRepayment"
				class="tw-inline tw-text-action hover:tw-underline"
				@click="useFunds"
			>
				relend Now.
			</button>
			<button
				v-else-if="showTruncatedBody"
				class="tw-inline tw-text-action hover:tw-underline"
				@click="openLightbox"
			>
				read more
			</button>
		</div>
		<div
			:class="[
				'tw-flex tw-items-center tw-mt-auto',
				{ 'tw-justify-between': isFundraising },
				{ 'tw-justify-end': !isFundraising },
			]"
		>
			<button
				v-if="isFundraising"
				class="tw-flex tw-items-center"
				@click="shareLoan"
			>
				<div
					class="tw-rounded-full tw-bg-secondary tw-w-4 tw-h-4 tw-mr-1
						tw-flex tw-items-center tw-justify-center"
				>
					<KvMaterialIcon
						class="tw-w-2 tw-h-2 tw-text-action"
						:icon="mdiExportVariant"
					/>
				</div>
				<span class="tw-text-small tw-font-medium">Share</span>
			</button>

			<div class="tw-flex tw-text-secondary tw-text-small">
				<span v-if="updateNumber">
					Update #{{ updateNumber }} <span class="tw-mx-1">&bull;</span>
				</span>
				<span>{{ uploadDate }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { format } from 'date-fns';
import { mdiExportVariant } from '@mdi/js';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import BorrowerImageTriple from '#src/components/BorrowerProfile/BorrowerImageTriple';
import { KvMaterialIcon, KvUserAvatar } from '@kiva/kv-components';
import { isLoanFundraising } from '#src/util/loanUtils';
import {
	computed,
	toRefs,
	defineProps,
	inject,
	onMounted,
} from 'vue';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	update: {
		type: Object,
		required: true,
	},
	updateNumber: {
		type: String,
		default: '',
	},
});

const { update } = toRefs(props);

const emit = defineEmits(['read-more-clicked', 'share-loan-clicked']);

const loan = computed(() => update.value?.loan ?? {});
const borrowerName = computed(() => loan.value?.name ?? '');
const borrowerCountry = computed(() => loan.value?.geocode?.country?.name ?? '');
const hash = computed(() => loan.value?.image?.hash ?? '');
const title = computed(() => {
	if (update.value?.isTransaction && update.value?.isRepayment) {
		return `${borrowerName.value} from ${borrowerCountry.value}`;
	}
	if (update.value?.isTransaction) return 'Kiva';
	return `${borrowerName.value} from ${borrowerCountry.value}`;
});

const isFundraising = computed(() => isLoanFundraising(loan.value));

const loanStatus = computed(() => {
	if (update.value?.isTransaction && update.value?.isRepayment) {
		return 'Repayment';
	}
	if (update.value?.isTransaction) return 'Transaction';
	if (isFundraising.value) {
		return '🎉 Fundraising';
	}
	return '🎉 Repaying';
});

const subject = computed(() => update.value?.subject ?? '');
const body = computed(() => {
	return update.value?.body ?? '';
});
const truncatedBody = computed(() => {
	let truncatedCopy = body.value.split(' ').splice(0, 14).join(' ');
	if (truncatedCopy.length < body.value.length) {
		truncatedCopy += '...&nbsp;';
	}
	return truncatedCopy;
});

const showTruncatedBody = computed(() => body.value.length > truncatedBody.value.length || update.value?.isTransaction);

const uploadDate = computed(() => {
	const date = update.value?.date ?? '';
	const dateObj = !date ? new Date() : new Date(date);
	return format(dateObj, 'LLL. d, yyyy');
});

const openLightbox = () => {
	emit('read-more-clicked', update.value.id);
	$kvTrackEvent('portfolio', 'click', 'borrower-update-read-more', update.value.id);
};

const shareLoan = () => {
	emit('share-loan-clicked');
	$kvTrackEvent('portfolio', 'click', 'borrower-update-share-loan', loan.value.id);
};

// Fire Snowplow event when at least one repayment card is shown
onMounted(() => {
	if (update.value?.isRepayment) {
		$kvTrackEvent('portfolio', 'view', 'At least one repayment update viewed');
	}
});

// Update the CTA click handler for repayment cards
const useFunds = () => {
	// Fire Snowplow event for repayment card click
	$kvTrackEvent('portfolio', 'click', 'repayment-update-read-more', update.value.id);
	// Redirect user to relending or funds usage page
	window.location.href = '/lend/filter';
};

const subjectLine = computed(() => {
	if (update.value?.isTransaction) {
		return subject.value;
	}
	return `Subject line: ${subject.value}`;
});
</script>

<style lang="postcss" scoped>
	.kiva-logo:deep(div:first-child) {
		@apply tw-w-6 tw-h-6 lg:tw-w-8 lg:tw-h-8;
	}
</style>
