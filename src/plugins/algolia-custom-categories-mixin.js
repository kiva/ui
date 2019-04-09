import _forEach from 'lodash/forEach';

export default {
	data() {
		return {
			customCategoryAttributes: ['sector.name', 'themeData.loanThemeTypeName', 'tags.name'],
		};
	},
	computed: {
		customCategoryItems() {
			const items = [];
			_forEach(
				this.selectedCustomCategories,
				(customCategoryEnabled, selectedCustomCategoryId) => {
					if (!customCategoryEnabled) {
						return;
					}
					items.push({
						attribute: selectedCustomCategoryId,
						label: this.getCustomCategoryLabel(selectedCustomCategoryId),
						refine: () => {
							this.removeCustomCategory(selectedCustomCategoryId);
						},
						type: 'CustomCategory',
					});
				},
			);
			return items;
		}
	},
	methods: {
		getCustomCategoryLabel(customCategoryId) {
			return this.customCategories[customCategoryId].name;
		},
	},
};
