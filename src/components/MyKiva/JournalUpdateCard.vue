<template>
	<div class="tw-rounded tw-bg-white tw-p-2 update-card">
		<div class="tw-flex tw-gap-1">
			<div
				class="tw-w-6 tw-h-6 lg:tw-w-8 lg:tw-h-8 tw-rounded-full tw-shadow"
			>
				<BorrowerImage
					class="tw-w-full tw-rounded-full tw-bg-brand"
					:alt="borrowerName"
					:aspect-ratio="1"
					:default-image="{ width: 80, faceZoom: 50 }"
					:hash="hash"
					:images="[
						{ width: 80, faceZoom: 50, viewSize: 1024 },
						{ width: 72, faceZoom: 50, viewSize: 734 },
						{ width: 64, faceZoom: 50 },
					]"
				/>
			</div>
			<div class="tw-flex tw-flex-col tw-items-start">
				<p class="tw-mb-0.5 tw-font-medium">
					{{ title }}
				</p>
				<div class="tw-py-0.5 tw-px-1 tw-font-medium tw-text-small tw-bg-eco-green-1 tw-rounded tw-w-auto">
					🎉 {{ loanStatus }}
				</div>
			</div>
		</div>
		<div class="tw-my-1">
			<p>{{ subject }}</p>
			<span v-html="truncatedBody"></span>
			<button
				v-if="showTruncatedBody"
				class="tw-inline tw-text-action hover:tw-underline"
				@click="openLightbox"
			>
				read more
			</button>
		</div>
		<div
			:class="[
				'tw-flex tw-items-center tw-mt-2.5',
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
				<div v-if="updateNumber">
					Update #{{ updateNumber }} <span class="tw-mx-1">&bull;</span>
				</div>
				<span>{{ uploadDate }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { format } from 'date-fns';
import { mdiExportVariant } from '@mdi/js';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import { KvMaterialIcon } from '@kiva/kv-components';
import { isLoanFundraising } from '#src/util/loanUtils';
import {
	computed,
	toRefs,
	defineProps,
	inject,
} from 'vue';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	loan: {
		type: Object,
		required: true,
	},
	update: {
		type: Object,
		required: true,
	},
	updateNumber: {
		type: String,
		default: '',
	},
});

const { loan, update } = toRefs(props);

const emit = defineEmits(['read-more-clicked', 'share-loan-clicked']);

const borrowerName = computed(() => loan.value?.name ?? '');
const borrowerCountry = computed(() => loan.value?.geocode?.country?.name ?? '');
const hash = computed(() => loan.value?.image?.hash ?? '');
const title = computed(() => `${borrowerName.value} from ${borrowerCountry.value}`);

const isFundraising = computed(() => isLoanFundraising(loan.value));

const loanStatus = computed(() => {
	if (isFundraising.value) {
		return 'Fundraising';
	}
	return 'Repaying';
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

const showTruncatedBody = computed(() => body.value.length > truncatedBody.value.length);

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
</script>

<style lang="postcss" scoped>
.update-card {
	width: 322px;

	@screen md {
		width: 422px;
	}
}
</style>
