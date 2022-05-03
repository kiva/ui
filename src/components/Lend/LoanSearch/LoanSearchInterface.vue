<template>
	<kv-grid class="tw-grid-cols-2 md:tw-grid-cols-3">
		<loan-search-filter />
		<div class="md:tw-hidden">
			<p>{{ totalCount }} Loans</p>
		</div>
		<div class="tw-col-span-2">
			<div class="tw-bg-tertiary tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
				Search Loans
			</div>
			<div class="tw-hidden md:tw-block tw-h-4 tw-mb-2 md:tw-mb-3 lg:tw-mb-3.5">
				<p>{{ totalCount }} Loans</p>
			</div>
			<kv-grid class="tw-grid-rows-4">
				<loan-card-controller
					v-for="loan in loans"
					:items-in-basket="null"
					:is-visitor="true"
					:key="loan.id"
					:loan="loan"
					loan-card-type="ListLoanCard"
				/>
			</kv-grid>
		</div>
	</kv-grid>
</template>

<script>
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		LoanCardController,
		KvGrid,
		LoanSearchFilter
	},
	data() {
		return {
			totalCount: 0,
			loans: [],
		};
	},
};
</script>
