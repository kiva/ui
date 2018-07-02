<template>
	<kv-button
		class="button"
		v-kv-track-event="['Lending', 'click-Read more', 'lend-again-button-click', id, 'true']"
		:to="`/lend/${ id }`"
		v-on="$listeners">
		Lend again
	</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		id: {
			type: Number,
			default: null
		},
	},
};

</script>
