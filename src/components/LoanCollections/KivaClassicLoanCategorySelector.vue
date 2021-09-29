<template>
	<div
		class="tw-flex tw-justify-start md:tw-justify-center
			md:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"
	>
		<kv-button
			class="tw-mx-1 md:tw-mb-3"
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
