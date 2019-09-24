<template>
	<!-- <kv-pill-toggle
		class="pill-toggle"
		:options="items.label"
		:selected="isGroupOptionSelected"
		@pill-toggled="groupPillToggled"
	/> -->

	<!-- Based on the Algolia doc found here:
	https://www.algolia.com/doc/api-reference/widgets/numeric-menu/vue/#examples
	the following code should work. It does not... -->

	<ul>
		<li
			:v-for="item in items"
			:key="item.value"
			@click.prevent="refine(item.value)"
		>
			{{ item.label }}
		</li>
	</ul>
</template>

<script>
// import _filter from 'lodash/filter';
// import KvPillToggle from '@/components/Kv/KvPillToggle';

export default {
	components: {
		// KvPillToggle,
	},
	props: {
		refine: {
			type: Function,
			required: true,
		},
		items: {
			type: Array,
			required: true,
		},
	},
	// computed: {
	// 	isGroupOptionSelected() {
	// 		const refinedOption = _filter(this.items, { isRefined: true });
	// 		if (refinedOption.length) {
	// 			return refinedOption[0].value;
	// 		}
	// 		return 'All';
	// 	}
	// },
	// methods: {
	// 	groupPillToggled() {
	// 		if (this.item.label === 'All') {
	// 			this.refine('');
	// 		} else {
	// 			this.refine(this.item.label);
	// 		}
	// 	},
	// },
};
</script>

<style lang="scss" scoped>
@import 'settings';

.pill-toggle {
	display: flex;
	font-size: 0.875rem;
	margin: 0.5rem 0;
}
</style>
