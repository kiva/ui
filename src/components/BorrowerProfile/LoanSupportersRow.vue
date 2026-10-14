<template>
	<div
		v-if="lenderCount > 0 && loan.status === FUNDRAISING"
		class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-bg-gray-100 tw-py-2"
		data-testid="bp-loan-supporters-row"
	>
		<div
			v-if="loading"
			class="tw-flex tw-shrink-0"
			aria-hidden="true"
			data-testid="bp-loan-supporters-loading"
		>
			<kv-loading-placeholder
				v-for="n in placeholderCount"
				:key="n"
				class="!tw-w-3 !tw-h-3 !tw-rounded-full"
				:class="{ 'tw--ml-1': n > 1 }"
			/>
		</div>
		<supported-by-lenders
			v-else-if="lenders"
			class="tw-shrink-0"
			:participants="lenders"
			minimal
		/>
		<p class="tw-min-w-0 tw-truncate tw-font-medium tw-text-primary" data-testid="bp-loan-supporters-text">
			{{ supportersText }}
		</p>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { gql } from 'graphql-tag';
import numeral from 'numeral';
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import { FUNDRAISING } from '#src/api/fixtures/LoanStatusEnum';
import useApolloQuery from '#src/composables/useApolloQuery';
import SupportedByLenders from '#src/components/BorrowerProfile/SupportedByLenders';

defineOptions({ name: 'LoanSupportersRow' });

const props = defineProps({
	loan: {
		type: Object,
		required: true,
	},
});

const MAX_AVATARS = 5;

const loanSupportersQuery = gql`query loanSupporters($loanId: Int!, $limit: Int) {
	lend {
		loan(id: $loanId) {
			id
			lenders(limit: $limit) {
				totalCount
				values {
					id
					name
					image {
						id
						url(customSize: "s64")
					}
				}
			}
		}
	}
}`;

// Loaded in the browser only, so the control version never fetches it
const { result, loading } = useApolloQuery(
	{ query: loanSupportersQuery, preFetch: false },
	() => ({ loanId: props.loan.id, limit: MAX_AVATARS }),
);

const lenders = computed(() => result.value?.lend?.loan?.lenders ?? null);
const lenderCount = computed(() => props.loan.lenders?.totalCount ?? 0);
const placeholderCount = computed(() => Math.min(lenderCount.value, MAX_AVATARS));

const supportersText = computed(() => {
	if (lenderCount.value === 1) {
		return `1 person supporting ${props.loan.name}`;
	}
	return `${numeral(lenderCount.value).format('0,0')} others supporting ${props.loan.name}`;
});
</script>
