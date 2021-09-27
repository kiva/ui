<template>
	<div
		class="tw-flex tw-justify-center tw-max-w-[700px] tw-flex-wrap tw-mx-auto"
	>
		<kv-button
			class="tw-mx-1 tw-mb-3"
			v-for="category in loanChannels" :key="category.id"
			:variant="selectedChannel === category.id ? 'link' : 'ghost'"
			@click="handleCategoryClick(category.id)"
		>
			{{ category.shortName }}
		</kv-button>
	</div>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		KvButton,
	},
	props: {
		/**
		 * Array of loan channel data in an object
		* */
		loanChannels: {
			type: Array,
			default: () => [],
		},
		selectedChannel: {
			type: Number,
			default: 0
		}
	},
	methods: {
		handleCategoryClick(categoryId) {
			this.$emit('handle-category-click', { categoryId });
			return false;
		}
	}
};
</script>
