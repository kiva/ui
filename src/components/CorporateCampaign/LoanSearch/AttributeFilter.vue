<template>
	<div>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="attributes"
					:items="attributesWithSelected"
					:use-columns="true"
					@change="onChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from '@/pages/Autolending/CheckList';

export default {
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	props: {
		allAttributes: {
			type: Array,
			default: () => []
		},
		initialAttributes: {
			type: Array,
			default: () => []
		},
		selectedAttributes: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			currentAttributeIds: [],
		};
	},
	created() {
		this.setFilterState();
	},
	computed: {
		attributesWithSelected() {
			return this.eligibleAttributes.map(({ id, name }) => {
				return {
					id,
					name,
					selected: this.currentAttributeIds.indexOf(id) > -1,
				};
			});
		},
		eligibleAttributes() {
			// filters all Attributes against prescribed lsc theme
			const eligibleAttributes = this.allAttributes.filter(attribute => {
				// TODO: potentially exclude some attributes simimlar to lend/filter
				if (this.initialAttributes.length) {
					return this.initialAttributes.includes(attribute.name) || false;
				}
				return true;
			});
			return eligibleAttributes || [];
		},
	},
	watch: {
		initialAttributes(next, prev) {
			if (!this.selectedAttributes && next !== prev) {
				this.setFilterState();
			}
		},
		selectedAttributes(next, prev) {
			if (next !== prev) {
				this.setFilterState();
			}
		}
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changeAttributes(this.getValues(checked, values, this.currentAttributeIds));
		},
		changeAttributes(attributes) {
			// Filter for selected attributes
			const selectedAttributes = this.eligibleAttributes.filter(attribute => {
				return attributes.includes(attribute.id);
			});
			// Get array selected attribute ids for maintaining state
			const attributeIds = selectedAttributes.map(attribute => {
				return attribute.id;
			});
			this.currentAttributeIds = attributeIds;
			// Get list of Attribute Names for loan query
			const attributeNames = selectedAttributes.map(attribute => {
				return attribute.name;
			});
			this.$emit('updated-filters', { theme: attributeNames });
		},
		setFilterState() {
			// set currently selected if present
			if (this.selectedAttributes) {
				this.currentAttributeIds = this.getFilterIdsFromNames(this.selectedAttributes);
				return true;
			}
			// fallback to initial settings if present
			if (this.initialAttributes) {
				this.currentAttributeIds = this.getFilterIdsFromNames(this.initialAttributes);
				return true;
			}
		},
		getFilterIdsFromNames(incomingAttributeNameArray) {
			// Filter for selected attributes
			const selectedAttributesByName = this.eligibleAttributes.filter(attribute => {
				return incomingAttributeNameArray.includes(attribute.name);
			});

			const attributeIds = selectedAttributesByName.map(attribute => {
				return attribute.id;
			});
			return attributeIds;
		}
	},
};
</script>

<style lang="scss" scoped>
// @import 'settings';

</style>
