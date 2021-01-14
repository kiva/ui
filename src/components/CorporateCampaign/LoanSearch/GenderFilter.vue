<template>
	<div class="gender-radios">
		<h3 class="filter-title">
			Genders
		</h3>
		<kv-radio
			id="gender-radio-both"
			radio-value="both"
			v-model="gender"
		>
			Everyone
		</kv-radio>
		<kv-radio
			id="gender-radio-female"
			radio-value="female"
			v-model="gender"
		>
			Women only
		</kv-radio>
		<kv-radio
			id="gender-radio-male"
			radio-value="male"
			v-model="gender"
		>
			Men only
		</kv-radio>
	</div>
</template>

<script>
import KvRadio from '@/components/Kv/KvRadio';

export default {
	inject: ['apollo'],
	components: {
		KvRadio,
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
