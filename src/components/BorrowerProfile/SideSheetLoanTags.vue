<template>
	<div class="tw-flex tw-justify-center">
		<KvLoanCallouts
			:callouts="loanCallouts"
			:add-bg-color="false"
			class="loan-callouts"
		/>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, reactive } from 'vue';
import { loanCardComputedProperties, KvLoanCallouts } from '@kiva/kv-components';
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';

const props = defineProps({
	loanId: {
		type: Number,
		default: 0,
		required: true
	}
});

const { loan } = useBorrowerProfileData();

const computedPropertiesVariables = reactive({
	loan,
	loanId: props.loanId,
	categoryPageName: '',
	customCallouts: [],
});

const { loanCallouts } = loanCardComputedProperties(computedPropertiesVariables);
</script>

<style lang="postcss" scoped>
.loan-callouts :deep(span) {
  @apply !tw-bg-transparent tw-text-action;
}
</style>
