<template>
	<fieldset class="tw-flex tw-flex-col tw-gap-2 tw-my-2">
		<kv-radio
			v-for="option in genderOptions"
			:key="option.key"
			:value="option.key"
			v-model="selectedGender"
			@change="setGender"
		>
			{{ option.title }}
		</kv-radio>
	</fieldset>
</template>

<script>
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';

export const BOTH_TITLE = 'All genders';
export const FEMALE_KEY = 'female';
export const FEMALE_TITLE = 'Women';
export const MALE_KEY = 'male';
export const MALE_TITLE = 'Men';
export const NON_BINARY_TITLE = 'Non-binary';
export const NON_BINARY_KEY = 'nonbinary';

export default {
	name: 'LoanSearchGenderFilter',
	components: {
		KvRadio,
	},
	props: {
		gender: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			selectedGender: this.gender || '',
			genderOptions: [
				{
					title: BOTH_TITLE,
					key: '',
				},
				{
					title: FEMALE_TITLE,
					key: FEMALE_KEY,
				},
				{
					title: MALE_TITLE,
					key: MALE_KEY,
				},
				{
					title: NON_BINARY_TITLE,
					key: NON_BINARY_KEY,
				},
			]
		};
	},
	methods: {
		setGender(gender) {
			if (gender !== this.selectedGender) {
				this.selectedGender = gender;

				// Return null as default to match GraphQL enum default
				this.$emit('updated', { gender: this.selectedGender || null });

				this.$kvTrackEvent?.('Lending', 'click-gender-filter', this.selectedGender);
			}
		},
	},
	watch: {
		gender(next) {
			// The KvRadio component can't handle a null value
			const nextGender = this.genderOptions.map(g => g.key).includes(next) ? next : '';

			if (nextGender !== this.selectedGender) {
				// Don't emit when value is changed via the component prop
				this.selectedGender = nextGender;
			}
		},
	},
};
</script>
