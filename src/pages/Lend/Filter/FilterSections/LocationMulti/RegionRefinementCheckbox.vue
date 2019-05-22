<template>
	<div v-if="showRegionRefinement">
		<kv-controlled-checkbox
			:is-checked="isChecked"
			:label="controlledCheckboxLabel"
			@checkbox-input="handleRegionCheckboxInput"
		/>
	</div>
</template>

<script>
import KvControlledCheckbox from '@/components/Kv/KvControlledCheckbox';

export default {
	props: {
		region: {
			type: String,
			required: true,
		},
		isChecked: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array,
			default: () => [],
		},
		refine: {
			type: Function,
			default: () => {},
		},
	},
	components: {
		KvControlledCheckbox,
	},
	computed: {
		regionCount() {
			return this.items.length ? this.items[0].count : 0;
		},
		showRegionRefinement() {
			return !!this.regionCount;
		},
		controlledCheckboxLabel() {
			return `${this.region} (${this.regionCount})`;
		},
	},
	methods: {
		handleRegionCheckboxInput() {
			this.$emit('checkbox-input');
		},
		toggleRefinement() {
			if (this.items.length) {
				this.refine(this.items[0].value);
			}
		},
	},
};
</script>
