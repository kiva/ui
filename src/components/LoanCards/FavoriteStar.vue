<template>
	<button
		v-kv-track-event="['Lending', 'click-Favorite star', 'Favorite', loanId, loanId]"
		@click.prevent.stop="toggleFavorite"
	>
		<kv-icon name="star" :from-sprite="true" class="icon-star" :class="{ 'is-favorite': isFavorite }" />
	</button>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	props: {
		isFavorite: {
			type: Boolean,
			default: false
		},
		loanId: {
			type: Number,
			default: null
		},
	},
	methods: {
		toggleFavorite() {
			this.$emit('favorite-toggled');
		}
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	button {
		outline-style: none;
	}

	.icon-star {
		height: 2rem;
		width: 2rem;
		fill: transparent;
		color: $white;
		opacity: 0.5;
		background-color: $kiva-text-dark;
		padding: 0.5rem;
		vertical-align: bottom;
	}

	.is-favorite {
		opacity: 1;
		color: $kiva-alert-yellow;
	}
</style>
