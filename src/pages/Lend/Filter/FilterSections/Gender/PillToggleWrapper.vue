<template>
	<kv-pill-toggle
		class="tw-text-small tw-flex tw-my-1"
		id="gender-options"
		:options="genderOptions"
		:selected="genderOptionSelected"
		@pill-toggled="genderPillToggled"
	/>
</template>

<script>
import KvPillToggle from '@/components/Kv/KvPillToggle';

export default {
	name: 'PillToggleWrapper',
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
			const refinedOption = this.items.find(genderOptionObj => genderOptionObj.isRefined);
			if (refinedOption) {
				return refinedOption.value;
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
