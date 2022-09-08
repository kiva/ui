<template>
	<div
		class="tw-flex tw-justify-start tw-flex-row md:tw-flex-col md:tw-justify-center
			md:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"
	>
		<kv-tabs vertical="true" class="tabs-container">
			<template #tabNav>
				<kv-tab
					class="md:tw-truncate"
					:for-panel="`tab-${category.id}`"
					:vertical="true"
					v-for="category in loanChannels" :key="category.id"
					@click.native="handleCategoryClick(category)"
				>
					{{ category.shortName }}
				</kv-tab>
			</template>
		</kv-tabs>
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
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTab from '~/@kiva/kv-components/vue/KvTab';
import KvTabs from '~/@kiva/kv-components/vue/KvTabs';

export default {
	name: 'LoanCategorySelectorHomeExp',
	components: {
		KvButton, KvTab, KvTabs
	},
	data() {
		return {
			categoryBtnStyle: 'vertical-tab',
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

<style lang="scss" scoped>
	@media(min-width: 734px) {

		.tabs-container {
			width: 15.25rem;
			@apply tw-flex md:tw-flex-col;
		}
	}
</style>
