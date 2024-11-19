<template>
	<span v-if="counting">
		<kv-loading-spinner size="small" class="tw-inline-block" />
	</span>
	<span v-else>
		{{ $filters.numeral(count, '0,0') }}
	</span>
</template>

<script>
import KvLoadingSpinner from '#kv-components/KvLoadingSpinner';

export default {
	name: 'LoanCountSpan',
	props: {
		count: {
			type: Number,
			default: 0,
		},
		counting: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		KvLoadingSpinner,
	},
};
</script>
