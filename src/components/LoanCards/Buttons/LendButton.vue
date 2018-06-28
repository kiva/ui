<template>
	<kv-button
		class="button"
		v-kv-track-event="['Lending', 'click-Read more', 'lend-button-click', id, 'true']"
		v-on="listeners">
		Lend $25
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
		listeners: {
			type: Number,
			default: null
		},
	},
};

</script>
