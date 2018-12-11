<template>
	<kv-button :to="`/lend/${loanId}`" class="read-more-button">
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
