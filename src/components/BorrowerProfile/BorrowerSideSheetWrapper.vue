<template>
	<KvSideSheet
		:kv-track-function="kvTrackFunction"
		:show-back-button="false"
		:show-go-to-link="true"
		:show-headline-border="true"
		:visible="showSideSheet"
		:width-dimensions="{ default: '100%', xl:'600px', lg: '50%', md:'50%', sm: '100%' }"
		@go-to-link="goToLink"
		@side-sheet-closed="handleCloseSideSheet"
	>
		<BorrowerSideSheetContent
			:basket-items="basketItems"
			:is-adding="isAdding"
			:loan-id="selectedLoanId"
			:show-next-steps="showNextSteps"
			:enable-ai-loan-pills="enableAiLoanPills"
			@add-to-basket="addToBasket"
		/>
	</KvSideSheet>
</template>

<script setup>
import { defineProps } from 'vue';
import BorrowerSideSheetContent from '#src/components/BorrowerProfile/BorrowerSideSheetContent';
import { KvSideSheet } from '@kiva/kv-components';

const props = defineProps({
	basketItems: {
		type: Array,
		default: () => []
	},
	isAdding: {
		type: Boolean,
		default: false
	},
	kvTrackFunction: {
		type: Function,
		default: () => {}
	},
	selectedLoanId: {
		type: Number,
		default: null,
	},
	showBackButton: {
		type: Boolean,
		default: false
	},
	showGotToLink: {
		type: Boolean,
		default: false
	},
	showHeadlineBorder: {
		type: Boolean,
		default: false
	},
	showNextSteps: {
		type: Boolean,
		default: false
	},
	showSideSheet: {
		type: Boolean,
		default: false
	},
	widthDimensions: {
		type: Object,
		default: () => {}
	},
	enableAiLoanPills: {
		type: Boolean,
		default: false
	},
});

const emit = defineEmits([
	'add-to-basket',
	'close-side-sheet',
	'go-to-link',
]);

const addToBasket = lendAmount => {
	emit('add-to-basket', { loanId: props.selectedLoanId, lendAmount });
};

const goToLink = () => {
	emit('go-to-link');
};

const handleCloseSideSheet = () => {
	emit('close-side-sheet');
};

</script>
