<template>
	<kv-pill-toggle
		class="pill-toggle"
		:options="isGroupOptions"
		:selected="isGroupOptionSelected"
		@pill-toggled="groupPillToggled"
	/>
</template>

<script>
import _filter from 'lodash/filter';
import KvPillToggle from '@/components/Kv/KvPillToggle';

export default {
	components: {
		KvPillToggle,
	},
	data() {
		return {
			isGroupOptions: [
				{ key: 'both', title: 'Both' },
				{ key: 'individual', title: 'Individual' },
				{ key: 'group', title: 'Group' }
			],
		};
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
		filterMenuOpen: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		isGroupOptionSelected() {
			const refinedOption = _filter(this.items, { isRefined: true });
			if (refinedOption.length) {
				return refinedOption[0].value;
			}
			return 'both';
		}
	},
	methods: {
		groupPillToggled(key) {
			if (key === 'both') {
				this.refine('');
			} else {
				this.refine(key);
			}
		},
	},
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
