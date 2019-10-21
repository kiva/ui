<template>
	<span v-if="counting">
		<kv-loading-spinner />
	</span>
	<span v-else>
		{{ count | numeral('0,0') }}
	</span>
</template>

<script>
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
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
