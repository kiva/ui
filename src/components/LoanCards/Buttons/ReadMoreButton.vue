<template>
	<kv-button :to="`/lend/${loanId}`" class="read-more-button">
		Read more
	</kv-button>
</template>

<script>
import KvButton from '#src/components/Kv/KvButton';

export default {
	name: 'ReadMoreButton',
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
