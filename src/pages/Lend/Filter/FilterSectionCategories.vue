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
import FilterMenuSection from '@/pages/Lend/Filter/FilterMenuSection';
import { AisRefinementList } from 'vue-instantsearch';
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
	components: {
		KvCheckbox,
		FilterMenuSection,
		AisRefinementList,
	},
	props: {
		customCategories: {
			type: Object,
			required: true,
		},
		selectedCustomCategories: {
			type: Object,
			required: true,
		},
		appliedFilters: {
			type: String,
			default: 'All',
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
	},
};
</script>
