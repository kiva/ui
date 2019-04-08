<template>
	<filter-menu-section title="Categories" :applied-filters="appliedFilters" >
		<kv-checkbox
			v-for="{name, categoryId, checkboxInput, isChecked} in customCategoryList"
			:key="categoryId"
			:label="name"
			:is-checked="isChecked"
			@checkbox-input="checkboxInput"
		/>
	</filter-menu-section>
</template>

<script>
import _map from 'lodash/map';
import algoliaCustomCategories from '@/plugins/algolia-custom-categories-mixin';
import FilterMenuSection from '@/pages/Lend/Filter/FilterMenuSection';
import { AisRefinementList } from 'vue-instantsearch';
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
	components: {
		KvCheckbox,
		FilterMenuSection,
		AisRefinementList,
	},
	mixins: [
		algoliaCustomCategories,
	],
	props: {
		customCategories: {
			type: Object,
			required: true,
		},
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
