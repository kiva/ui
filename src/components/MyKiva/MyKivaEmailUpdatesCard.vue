<template>
	<div class="card-container tw-h-full">
		<span
			class="tw-inline-flex tw-items-center tw-gap-1 tw-mb-2
						tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5
						tw-absolute md:!tw-top-2.5 md:!tw-left-2.5 tw-top-1.5 tw-left-1.5 tw-z-1"
		>
			<KvMaterialIcon
				class="tw-w-2 tw-h-2 tw-shrink-0"
				:icon="mdiEmailOutline"
			/>
			<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
				Email updates
			</span>
		</span>
		<div class="tw-relative tw-w-full tw-overflow-hidden image-container">
			<KvBorrowerImage
				class="tw-w-full tw-h-full tw-object-cover"
				:alt="name"
				:hash="hash"
				:aspect-ratio="3 / 4"
				:default-image="{ width: 304 }"
				:images="[{ width: 304 }]"
				:photo-path="$appConfig.photoPath"
			/>
		</div>
		<div class="tw-flex tw-flex-col tw-pt-1 tw-grow">
			<h3>
				Follow {{ borrowerName }} journey
			</h3>
			<p class="tw-font-medium tw-text-base tw-pt-0.5 tw-grow">
				Don't miss out on borrower updates, stories, and new ways to help.
			</p>
			<div class="tw-pt-1">
				<KvButton
					variant="secondary"
					v-kv-track-event="['portfolio', 'click', 'next-step-email-option']"
					class="tw-w-full"
					@click="handleEmailOptIn"
				>
					Get email updates
				</KvButton>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	KvMaterialIcon, KvButton, KvBorrowerImage,
} from '@kiva/kv-components';
import { mdiEmailOutline } from '@mdi/js';
import { computed, inject } from 'vue';
import useOptIn from '#src/composables/useOptIn';
import { formatPossessiveName } from '#src/util/stringParserUtils';

const props = defineProps({
	loans: {
		type: Array,
		default: () => [],
	},
	latestLoan: {
		type: Object,
		default: null,
	}
});

const emit = defineEmits(['accept-email-updates']);

// Get the most recent loan (first in sorted array)
const mostRecentLoan = computed(() => {
	const defaultLoan = props.loans?.[0] || null;
	return props.latestLoan !== null ? props.latestLoan : defaultLoan;
});

const borrowerName = computed(() => {
	return formatPossessiveName(mostRecentLoan.value?.name) || 'this borrower';
});

const name = computed(() => {
	return mostRecentLoan.value?.name || '';
});

const hash = computed(() => {
	return mostRecentLoan.value?.image?.hash || '';
});

const apollo = inject('apollo');
const cookieStore = inject('cookieStore');
const { setMailUpdatesOptOutCookie, updateCommunicationSettings } = useOptIn(apollo, cookieStore);

const handleEmailOptIn = async () => {
	const updatedEmailSettings = await updateCommunicationSettings(true, true, false);
	if (updatedEmailSettings) {
		setMailUpdatesOptOutCookie(false);
		emit('accept-email-updates', true);
	}
};

</script>

<style lang="postcss" scoped>
.card-container {
	z-index: 1;

	@apply tw-w-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white tw-shrink-0;
}

.image-container :deep(picture) {
	@apply !tw-pb-0 tw-rounded;

	height: 183px;
	object-fit: cover;
}

.image-container :deep(picture img) {
	@apply tw-object-cover tw-object-center;

    height: 183px;
    object-fit: cover;
}
</style>
