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
			<div>
				<p class="tw-mb-0.5 tw-font-medium">
					{{ title }}
				</p>
				<div class="tw-py-0.5 tw-px-1 tw-font-medium tw-text-small tw-bg-eco-green-1 tw-rounded">
					🎉 {{ loanStatus }}
				</div>
			</div>
		</div>
		<div class="tw-my-1">
			<p>{{ subject }}</p>
			<p v-html="body"></p>
			<button>read more</button>
		</div>
		<div class="tw-flex tw-justify-end tw-text-secondary tw-text-small">
			<div>
				Update #1 <span class="tw-mx-1">&bull;</span>
			</div>
			<span>Date</span>
		</div>
	</div>
</template>

<script setup>
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import { isLoanFundraising } from '#src/util/loanUtils';
import {
	computed,
	toRefs,
	defineProps,
} from 'vue';

const props = defineProps({
	loan: {
		type: Object,
		required: true,
	},
	update: {
		type: Object,
		required: true,
	},
});

const { loan, update } = toRefs(props);

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
const body = computed(() => update.value?.body ?? '');
</script>

<style lang="postcss" scoped>
.update-card {
	width: 322px;

	@screen lg {
		width: 422px;
	}
}
</style>
