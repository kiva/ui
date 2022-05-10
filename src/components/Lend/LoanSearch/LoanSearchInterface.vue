<template>
	<div class="tw-flex">
		<div id="mobile-menu" class="tw-rounded md:tw-hidden
				tw-z-dropdown tw-drop-shadow tw-absolute tw-top-4 md:tw-top-0"
		>
			<loan-search-filter />
		</div>
		<div class="tw-flex tw-flex-col tw-mr-4">
			<div class="md:tw-hidden tw-mb-3">
				<kv-button variant="secondary">
					Filter & Sort
				</kv-button>
			</div>
			<div class="tw-hidden md:tw-block">
				<loan-search-filter />
			</div>
		</div>
		<div class="md:tw-hidden tw-pt-1.5">
			<p>{{ totalCount }} Loans</p>
		</div>
		<div class="tw-col-span-2">
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
	</div>
</template>

<script>
import LoanCardController from '@/components/LoanCards/LoanCardController';
import LoanSearchFilter from '@/components/Lend/LoanSearch/LoanSearchFilter';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		LoanCardController,
		KvGrid,
		KvButton,
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

<style lang="scss" scoped>
	#mobile-menu {
		width: 285px;
	}
</style>
