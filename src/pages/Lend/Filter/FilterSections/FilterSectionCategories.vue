<template>
	<filter-menu-section title="Categories" :applied-filters="appliedFilters" class="filter-section-categories">
		<kv-checkbox
			v-for="{name, categoryId, checkboxInput, isChecked} in customCategoryList"
			class="category-checkbox tw-mb-1"
			:key="categoryId"
			:checked="isChecked"
			@change="checkboxInput"
		>
			{{ name }}
		</kv-checkbox>
	</filter-menu-section>
</template>

<script>
import _map from 'lodash/map';
import algoliaCustomCategories from '@/plugins/algolia-custom-categories-mixin';
import FilterMenuSection from '@/pages/Lend/Filter/FilterComponents/FilterMenuSection';
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
	name: 'FilterSectionCategories',
	components: {
		KvCheckbox,
		FilterMenuSection,
	},
	mixins: [
		algoliaCustomCategories,
	],
	props: {
		selectedCustomCategories: {
			type: Object,
			required: true,
		},
	},
	methods: {
		toggleCustomCategory(categoryId) {
			this.$emit('toggle-custom-category', categoryId);
		},
	},
	computed: {
		customCategoryList() {
			return _map(this.customCategories, (category, categoryId) => ({
				...category,
				categoryId,
				checkboxInput: () => {
					this.toggleCustomCategory(categoryId);
				},
				isChecked: !!this.selectedCustomCategories[categoryId],
			}));
		},
		appliedFilters() {
			switch (this.customCategoryItems.length) {
				case 0: {
					return 'All';
				}
				case 1: {
					return this.customCategoryItems[0].label;
				}
				default: {
					return `${this.customCategoryItems.length} categories selected`;
				}
			}
		},
	},
};
</script>
