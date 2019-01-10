<template>
	<kv-button @click.native="addToBasket"
		v-kv-track-event="['Lending', 'Add to basket', 'lend-button-click', loanId, 'true']"
		class="lend-button"
	>
		<slot>Lend now</slot>
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
		price: {
			type: [Number, String],
			default: 25,
		},
	},
	methods: {
		addToBasket() {
			this.$emit('lend', this.price);
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.lend-by-category-page .adding-to-basket.button.smaller {
	font-size: 1rem;
}
</style>
