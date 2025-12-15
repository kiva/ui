<template>
	<div
		class="tw-w-full tw-relative tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col
			tw-bg-white tw-shrink-0 tw-overflow-hidden tw-h-full"
	>
		<span
			class="tw-inline-flex tw-items-center tw-gap-1 tw-mb-2
						tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5
						tw-absolute tw-top-2.5 tw-left-2.5 tw-z-1"
		>
			<KvMaterialIcon
				class="tw-w-2 tw-h-2 tw-shrink-0"
				:icon="mdiEarth"
			/>
			<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
				Your latest loan
			</span>
		</span>
		<KvMap
			class="
						tw-rounded
						tw-overflow-hidden
						tw-mb-3
					"
			:lat="30"
			:long="1"
			:zoom-level="1"
			:allow-dragging="false"
			:show-labels="false"
			:countries-data="countriesData"
			:show-fundraising-loans="showFundraisingLoans"
			@country-lend-filter="countryFilterClicked"
		/>
		<KvBorrowerImage
			class="tw-w-10 tw-h-10 tw-object-cover tw-rounded-full"
			:alt="name"
			:hash="hash"
			:aspect-ratio="1 / 1"
			:default-image="{ width: 80 }"
			:images="[{ width: 80 }]"
			:photo-path="$appConfig.photoPath"
		/>
		<div class="tw-flex tw-flex-col tw-pt-1 tw-grow">
			<h3>
				Step closer to {{ borrowerName }} story
			</h3>
			<p class="tw-font-medium tw-text-base tw-pt-0.5 tw-grow">
				See how your loan improves her live.
			</p>
			<div class="tw-pt-1">
				<KvButton
					variant="secondary"
					v-kv-track-event="['portfolio', 'click', 'next-step-email-option']"
					class="tw-w-full"
					@click="handleEmailOptIn"
				>
					View impact insights
				</KvButton>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	KvMaterialIcon, KvButton, KvBorrowerImage, KvMap,
} from '@kiva/kv-components';
import { mdiEarth } from '@mdi/js';
import { computed } from 'vue';
import { formatPossessiveName } from '#src/util/stringParserUtils';

const props = defineProps({
	loans: {
		type: Array,
		default: () => [],
	},
});

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
</script>

<style lang="postcss" scoped>
.card-container {
	width: 336px;
	min-height: 365px;
}
</style>
