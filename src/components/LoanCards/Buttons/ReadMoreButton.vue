<template>
	<kv-button :to="`/lend/${loanId}`">
		Read more
	</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
	},
};
</script>
