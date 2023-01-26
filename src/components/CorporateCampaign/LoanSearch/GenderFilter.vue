<template>
	<div class="gender-enum-sorting">
		<ul>
			<li class="tw-mb-1">
				<kv-radio
					v-for="genderOption in genderOptions"
					:key="genderOption.value"
					:value="genderOption.value"
					v-model="currentGender"
				>
					{{ genderOption.label }}
				</kv-radio>
			</li>
		</ul>
	</div>
</template>

<script>
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';

export default {
	name: 'GenderFilter',
	components: {
		KvRadio
	},
	props: {
		selectedGender: {
			type: String,
			default: null
		},
		initialGender: {
			type: String,
			default: 'women'
		}
	},
	data() {
		return {
			currentGender: null,
			genderOptions: [
				{ value: 'allGenders', label: 'All genders' },
				{ value: 'women', label: 'Women' },
				{ value: 'men', label: 'Men' },
				{ value: 'nonBinary', label: 'Non binary' },
			]
		};
	},
	created() {
		this.setGenderFilter();
	},
	watch: {
		initialGender(next, prev) {
			if (!this.selectedGender && next !== prev) {
				this.setGenderFilter();
			}
		},
		selectedGender(next, prev) {
			if (next !== prev) {
				this.setGenderFilter();
			}
		},
		currentGender(next, prev) {
			if (next !== prev) {
				this.$emit('gender-filter-updated', next);
			}
		}
	},
	methods: {
		setGenderFilter() {
			// set selected if present
			if (this.selectedGender) {
				this.currentGender = this.selectedGender;
				return true;
			}
			// fallback to initial gender
			this.currentGender = this.initialGender;
		}
	}
};
</script>
