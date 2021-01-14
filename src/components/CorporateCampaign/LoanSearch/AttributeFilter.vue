<template>
	<div>
		<h3 class="filter-title">
			Attributes
		</h3>
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
				return this.initialAttributes.includes(attribute.id) || false;
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
			this.currentAttributeIds = attributes;
			console.log(attributes);
			// this.$emit('updated-filters', { theme: attributes });
		},
		setFilterState() {
			// set currently selected if present
			if (this.selectedAttributes) {
				this.currentAttributeIds = this.selectedAttributes;
				return true;
			}
			// fallback to initial settings if present
			if (this.initialAttributes) {
				this.currentAttributeIds = this.initialAttributes;
				return true;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
// @import 'settings';

</style>
