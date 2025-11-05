<template>
	<div class="tw-rounded tw-bg-white tw-p-2 update-card tw-h-full tw-flex tw-flex-col">
		<div class="tw-flex tw-gap-1">
			<!-- Show triple image for repayment summary cards -->
			<div v-if="update.isRepayment && update.status === 'repayment-summary' && repaymentImages.length">
				<MultiBorrowerImage :images="repaymentImages" />
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
					class="tw-w-6 tw-h-6 lg:tw-w-8 lg:tw-h-8"
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
		<div
			class="tw-my-1"
		>
			<p
				class="tw-line-clamp-3"
			>
				<span v-html="displayText" class=" "></span>
				<span v-if="update.isRepayment">
					<button
						v-if="update.isRepayment"
						class="tw-inline tw-text-action hover:tw-underline"
						@click="useFunds"
					>
						relend now.
					</button>
				</span>
			</p>

			<button
				v-if="!update.isRepayment && showTruncatedBody "
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
import { KvMaterialIcon, KvUserAvatar } from '@kiva/kv-components';
import { isLoanFundraising } from '#src/util/loanUtils';
import {
	computed,
	toRefs,
	defineProps,
	inject,
	onMounted,
} from 'vue';
import MultiBorrowerImage from '#src/components/BorrowerProfile/MultiBorrowerImage';

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
const body = computed(() => update.value?.body ?? '');

function stripHtmlTags(html) {
	return html.replace(/<[^>]*>/g, '');
}
const displayText = computed(() => {
	if (update.value?.isRepayment) {
		return body.value;
	}
	if (update.value?.isTransaction) {
		return subject.value;
	}
	if (subject.value) {
		return stripHtmlTags(`Re: ${subject.value.trim()}. ${body.value}`);
	}
	return body.value;
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

const repaymentImages = computed(() => {
	return update.value?.repaymentImages.reduce((unique, img) => {
		if (!unique.some(imgoObj => imgoObj.hash === img.hash)) {
			unique.push(img);
		}
		return unique;
	}, []);
});

const openLightbox = () => {
	emit('read-more-clicked', update.value.id);
	$kvTrackEvent('portfolio', 'click', 'borrower-update-read-more', update.value.id);
};

const shareLoan = () => {
	emit('share-loan-clicked');
	$kvTrackEvent('portfolio', 'click', 'borrower-update-share-loan', loan.value.id);
};

onMounted(() => {
	if (update.value?.isRepayment) {
		$kvTrackEvent('portfolio', 'view', 'At least one repayment update viewed');
	}
});

const headerTitle = computed(() => {
	if (update.value?.livesToImpact === 1) {
		return `You-can-impact-${encodeURIComponent(update.value.livesToImpact)}-life-right-now`;
	}
	if (update.value?.livesToImpact > 1) {
		return `You-can-impact-${encodeURIComponent(update.value.livesToImpact)}-lives-right-now`;
	}
	return 'You-can-impact-lives-right-now';
});

const useFunds = () => {
	$kvTrackEvent('portfolio', 'click', 'repayment-update-read-more', update.value.id);

	window.location.href = `/lend/filter?header=${headerTitle.value}`;
};

</script>
