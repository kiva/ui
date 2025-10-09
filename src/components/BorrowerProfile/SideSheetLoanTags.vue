<template>
	<div class="tw-flex tw-justify-center">
		<KvLoadingPlaceholder v-if="loading" class="!tw-w-1/2 tw-mx-auto tw-mt-1 tw-h-3" />
		<KvLoanCallouts
			v-else
			:callouts="visibleCallouts"
			:add-bg-color="false"
			class="loan-callouts"
		/>
	</div>
</template>

<script lang="ts" setup>
import {
	computed,
	reactive,
	inject
} from 'vue';
import { loanCardComputedProperties, KvLoanCallouts, KvLoadingPlaceholder } from '@kiva/kv-components';

const props = defineProps({
	enableAiLoanPills: {
		type: Boolean,
		default: () => false,
	},
	aiLoanPills: {
		type: Array,
		default: () => ([]),
	},
});

const borrowerProfile = inject('borrowerProfile');

const loan = computed(() => borrowerProfile?.loan?.value ?? undefined);
const loanId = computed(() => borrowerProfile?.loan?.value?.id ?? undefined);
const loading = computed(() => !loan.value || !loanId.value);

const computedPropertiesVariables = reactive({
	loan,
	loanId,
	categoryPageName: '',
	customCallouts: [],
});

const { loanCallouts } = loanCardComputedProperties(computedPropertiesVariables);

const visibleCallouts = computed(() => {
	return props.enableAiLoanPills && props.aiLoanPills.length
		? props.aiLoanPills
		: loanCallouts.value;
});
</script>

<style lang="postcss" scoped>
.loan-callouts :deep(span) {
  @apply !tw-bg-transparent tw-text-action;
}
</style>
