<template>
	<div class="country-refinements-checkboxes">
		<kv-controlled-checkbox
			v-for="item in items"
			:key="item.value"
			:label="`${item.label} (${item.count})`"
			:is-checked="item.isRefined"
			@checkbox-input="refine(item.value)"
		/>
	</div>
</template>
<script>
import KvControlledCheckbox from '@/components/Kv/KvControlledCheckbox';

export default {
	components: {
		KvControlledCheckbox,
	},
	props: {
		items: {
			type: Array,
			default: () => [],
		},
		refine: {
			type: Function,
			default: () => {},
		},
	},
	methods: {
		removeRefinements() {
			this.items.forEach(item => {
				if (item.isRefined) {
					this.refine(item.value);
				}
			});
		},
	},
};
</script>
