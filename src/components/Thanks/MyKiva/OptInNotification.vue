<template>
	<div
		class="tw-flex tw-mx-auto tw-items-center tw-justify-start tw-gap-2 tw-bg-white tw-rounded tw-px-3 tw-py-1.5"
		:style="{maxWidth: '620px'}"
	>
		<div
			v-if="receiveNews"
			class="tw-flex tw-justify-center tw-items-center tw-z-1"
		>
			<borrower-image
				v-for="loan, index in filteredLoans"
				:key="loan.id"
				class="borrower-image"
				:class="{'centered-borrower' : index === 1 && filteredLoans.length === 3}"
				:style="{
					marginLeft: `${index > 0 ? -1 : 0}rem`,
					zIndex: `${index + 1}`,
				}"
				:aspect-ratio="0"
				:default-image="{ width: 200, faceZoom: 30 }"
				:hash="hash(loan)"
				:images="[
					{ width: 200, faceZoom: 30 },
				]"
			/>
		</div>
		<p class="tw-font-medium">
			{{ notificationMsg }}
		</p>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';

const props = defineProps({
	receiveNews: {
		type: Boolean,
		default: false
	},
	filteredLoans: {
		type: Array,
		default: () => ([]),
	},
});

const notificationMsg = computed(() => {
	if (props.receiveNews) {
		return 'Great, we’ll keep you updated.';
	}

	return 'We won’t send updates. You can change this setting at any time.';
});

const hash = loan => {
	return loan?.image?.hash ?? '';
};

</script>

<style lang="postcss" scoped>

.borrower-image {
	width: 36px !important;
	height: 36px !important;

	@apply tw-rounded-full tw-bg-black tw-border-2 tw-border-white tw-z-2;
}

.centered-borrower {
	width: 48px !important;
	height: 48px !important;

	@apply !tw-z-5;
}

</style>
