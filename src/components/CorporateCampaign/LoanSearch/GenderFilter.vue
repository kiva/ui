<template>
	<div class="gender-radios">
		<ul>
			<li
				v-for="genderOption in genderOptions" :key="genderOption.value"
				class="tw-mb-1 tw-px-1 tw-py-1"
			>
				<kv-radio
					:id="`gender-${genderOption.value}`"
					:value="genderOption.value"
					v-model="activeGender"
				>
					{{ genderOption.label }}
				</kv-radio>
			</li>
		</ul>
	</div>
</template>

<script>
import { KvRadio } from '@kiva/kv-components';

export default {
	name: 'GenderFilter',
	components: {
		KvRadio
	},
	emits: ['gender-updated'],
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
				this.$emit('gender-updated', { gender: next });
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
