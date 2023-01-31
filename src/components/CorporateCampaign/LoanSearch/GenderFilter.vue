<template>
	<div class="gender-radios">
		<kv-pill-toggle
			id="filter-gender"
			:options="genderOptions"
			:selected="gender"
			@pill-toggled="(val) => gender = val"
		/>
	</div>
</template>

<script>
import KvPillToggle from '@/components/Kv/KvPillToggle';

export default {
	name: 'GenderFilter',
	inject: ['apollo'],
	components: {
		KvPillToggle,
	},
	props: {
		initialGender: {
			type: String,
			default: null
		},
		selectedGender: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			gender: null,
			genderOptions: [
				{
					title: 'All genders',
					key: 'both',
				},
				{
					title: 'Women',
					key: 'female',
				},
				{
					title: 'Men',
					key: 'male',
				},
				{
					title: 'Non-binary',
					key: 'non-binary',
				},
			]
		};
	},
	watch: {
		gender(gender, previousGender) {
			if (gender !== previousGender && gender !== this.selectedGender) {
				this.$emit('updated-filters', {
					gender: this.gender === 'both' ? null : this.gender
				});
			}
		},
		initialGender(gender, previousGender) {
			if (!this.selectedGender && gender !== previousGender) {
				this.setFilterState();
			}
		},
		selectedGender(gender, previousGender) {
			if (gender !== previousGender) {
				this.setFilterState();
			}
		}
	},
	mounted() {
		this.setFilterState();
	},
	methods: {
		setFilterState() {
			// set currently selected if present
			if (this.selectedGender) {
				this.gender = this.selectedGender;
				return true;
			}
			// fallback to initial setting if present
			if (this.initialGender) {
				this.gender = this.initialGender;
				return true;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
// @import 'settings';
</style>
