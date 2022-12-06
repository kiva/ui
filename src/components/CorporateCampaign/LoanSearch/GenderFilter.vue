<template>
	<div class="gender-radios">
		<ul>
			<li v-for="genderOption in genderOptions" :key="genderOption.value" class="tw-mb-1">
				<kv-radio
					:id="`gender-${genderOption.value}`"
					:radio-value="genderOption.value"
					v-model="activeGender"
				>
					{{ genderOption.label }}
				</kv-radio>
			</li>
		</ul>
	</div>
</template>

<script>
import KvRadio from '@/components/Kv/KvRadio';

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
			default: null
		}
	},
	data() {
		return {
			activeGender: null,
			genderOptions: [
				{ value: 'both', label: 'All genders' },
				{ value: 'female', label: 'Women' },
				{ value: 'male', label: 'Men' },
				{ value: 'non-binary', label: 'Non-Binary' },
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
		activeGender(next, prev) {
			if (next !== prev) {
				this.$emit('gender-updated', next);
			}
		}
	},
	methods: {
		setGenderFilter() {
			// set selected if present
			if (this.selectedGender) {
				this.activeGender = this.selectedGender;
				return true;
			}
			// fallback to initial sort
			this.activeGender = this.initialGender;
		}
	}
};
</script>
