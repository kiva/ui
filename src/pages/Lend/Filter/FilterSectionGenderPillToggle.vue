<template>
	<div class="pill-toggle">
		<kv-pill-toggle
			:options="genderOptions"
			:selected="genderOptionSelected"
			@pill-toggled="genderPillToggled"
		/>
	</div>
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
			genderOptionSelected: 'all_genders',
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
	watch: {
		items(data) {
			// set gender pill to 'all genders' when menu is closed and gender filter has been removed
			if (this.filterMenuOpen === false && _filter(data, { isRefined: true }).length === 0) {
				this.genderOptionSelected = 'all_genders';
			}
		}
	},
	methods: {
		genderPillToggled(key) {
			// eslint-disable-next-line max-len
			// - issue: no ability to clear gender refinements, so applying a new refine applies any previous refinements
			// - solution: toggle (turn off) previous refinement

			// user selected female or male
			if (key !== 'all_genders') {
				// toggle previous gender selection
				if (this.genderOptionSelected !== 'all_genders') {
					this.refine(this.genderOptionSelected);
				}

				// apply gender selection
				this.refine(key);

			// user selected 'all_genders' and previous selection was female/male
			} else if (this.genderOptionSelected !== 'all_genders') {
				// toggle previous gender
				this.refine(this.genderOptionSelected);
			}

			this.genderOptionSelected = key;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.pill-toggle {
	align-items: center;
	display: flex;
	justify-content: center;
	margin: rem-calc(5);
	margin-left: rem-calc(1);
	margin-right: rem-calc(3);
}
</style>
