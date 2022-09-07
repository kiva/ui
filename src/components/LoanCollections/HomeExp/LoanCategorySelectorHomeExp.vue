<template>
	<div
		class="tw-flex tw-justify-start tw-flex-row md:tw-flex-col md:tw-justify-center
			md:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"
	>
		<kv-ui-button
			class="tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap left-border"
			:class="selectedChannel === category.id ? 'active' : ''"
			v-for="category in loanChannels" :key="category.id"
			@click.native="handleCategoryClick(category)"
		>
			{{ category.shortName }}
		</kv-ui-button>
		<kv-button
			class="tw-hidden md:tw-block tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap"
			:variant="buttonStyle"
			@click="goToCategoryPage"
		>
			Browse all
		</kv-button>
	</div>
</template>

<script>
import KvUiButton from '@/components/Kv/KvButton';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LoanCategorySelectorHomeExp',
	components: {
		KvButton,
		KvUiButton
	},
	data() {
		return {
			buttonStyle: 'primary'
		};
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
		handleCategoryClick(category) {
			const categoryId = category?.id ?? null;
			const categoryShortName = category?.shortName ?? '';
			// build event category from url, special case for homepage, clean page path otherwise
			const eventContext = this.$route.path === '/'
				? 'homepage'
				: this.$route.path.replace(/\//g, '-').replace('-', '');
			this.$kvTrackEvent(
				eventContext,
				'click-contentful-loan-carousel-category',
				categoryShortName,
				categoryId,
				categoryId
			);
			this.$emit('handle-category-click', { categoryId });
			return false;
		},
		goToCategoryPage() {
			window.location = '/lend-by-category/';
		}
	}
};
</script>
