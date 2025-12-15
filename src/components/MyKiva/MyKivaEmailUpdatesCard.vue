<template>
	<div class="card-container tw-h-full">
		<span
			class="tw-inline-flex tw-items-center tw-gap-1 tw-mb-2
						tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5
						tw-absolute tw-top-2.5 tw-left-2.5 tw-z-1"
		>
			<KvMaterialIcon
				class="tw-w-2 tw-h-2 tw-shrink-0"
				:icon="mdiEmailOutline"
			/>
			<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
				Email updates
			</span>
		</span>
		<div class="tw-relative tw-w-full tw-overflow-hidden tw-rounded image-container">
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
});

const emit = defineEmits(['accept-email-updates']);

// Get the most recent loan (first in sorted array)
const mostRecentLoan = computed(() => {
	return props.loans?.[0] || null;
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
const { setMailUpdatesOptOutCookie, updateCommunicationSettings } = useOptIn(apollo);

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
	@apply tw-w-full tw-relative tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col tw-bg-white
	tw-shrink-0 tw-overflow-hidden;

	width: 336px;
	min-height: 365px;
}

.image-container {
    width: 304px;
	height: 183px;
}

.image-container :deep(picture img) {
	@apply tw-object-cover tw-object-center;
}
</style>
