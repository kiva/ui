<template>
	<div class="loading-paragraph">
		<kv-loading-placeholder
			class="loading-paragraph__line"
			v-for="n in numLines"
			:key="n"
		/>
	</div>
</template>

<script>
import getCacheKey from '@/util/getCacheKey';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'KvLoadingParagraph',
	props: {
		numLines: {
			type: Number,
			default: 4,
		},
	},
	serverCacheKey: ({ numLines }) => getCacheKey(`KvLoadingParagraph-${numLines}`),
	components: {
		KvLoadingPlaceholder,
	},
};
</script>

<style lang="scss">
.loading-paragraph__line {
	height: 1rem;
	margin-bottom: 0.5rem;

	&:last-of-type {
		width: 70%;
	}
}
</style>
