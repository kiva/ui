<template>
	<kv-pill-toggle
		class="gender-pill-toggle"
		:options="genderOptions"
		:selected="genderOptionSelected"
		@pill-toggled="genderPillToggled"
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
			genderOptions: [
				{ key: 'all_genders', title: 'All genders' },
				{ key: 'female', title: 'Women' },
				{ key: 'male', title: 'Men' },
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
		genderOptionSelected() {
			const refinedOption = _filter(this.items, { isRefined: true });
			if (refinedOption.length) {
				return refinedOption[0].value;
			}
			return 'all_genders';
		}
	},
	methods: {
		genderPillToggled(key) {
			if (key === 'all_genders') {
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

.gender-pill-toggle {
	display: flex;
	font-size: 0.875rem;
	margin: 0.5rem 0;
}
</style>
