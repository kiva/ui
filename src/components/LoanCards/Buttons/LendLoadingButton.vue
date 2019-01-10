<template>
	<kv-button class="lend-button adding-to-basket">
		<kv-loading-spinner />
		Adding to basket
	</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvButton,
		KvLoadingSpinner,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.loading-spinner {
	width: 1.5rem;
	height: 1.5rem;
	vertical-align: middle;
	margin-right: 3px;
}

.lend-by-category-page .loading-spinner {
	width: 1.25rem;
	height: 1.25rem;
}

.loading-spinner >>> .line {
	background-color: $white;
}

.secondary .loading-spinner >>> .line {
	background-color: $charcoal;
}

.secondary:hover .loading-spinner >>> .line {
	background-color: $kiva-accent-blue;
}

.lend-by-category-page .adding-to-basket.button.smaller {
	font-size: 1rem;
}
</style>
