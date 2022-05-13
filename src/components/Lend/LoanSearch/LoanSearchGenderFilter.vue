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

export const BOTH_KEY = 'both';
export const BOTH_TITLE = 'All genders';
export const FEMALE_KEY = 'female';
export const FEMALE_TITLE = 'Women';
export const MALE_KEY = 'male';
export const MALE_TITLE = 'Men';
const GENDER_KEYS = [BOTH_KEY, FEMALE_KEY, MALE_KEY];

export default {
	components: {
		KvRadio,
	},
	props: {
		gender: {
			type: String,
			// TODO: determine if the default should be "null" (old component behavior) or "both"
			default: BOTH_KEY
		}
	},
	data() {
		return {
			selectedGender: this.gender || BOTH_KEY,
			genderOptions: [
				{
					title: BOTH_TITLE,
					key: BOTH_KEY,
				},
				{
					title: FEMALE_TITLE,
					key: FEMALE_KEY,
				},
				{
					title: MALE_TITLE,
					key: MALE_KEY,
				},
			]
		};
	},
	methods: {
		setGender(nextGender) {
			if (nextGender !== this.selectedGender) {
				// TODO: update the filters in cache, either here or emitted to parent
				this.selectedGender = nextGender;
			}
		},
	},
	watch: {
		gender(nextGender) {
			// TODO: determine if filter shouldn't change after user makes selection (old component behavior)
			if (!GENDER_KEYS.includes(nextGender)) {
				// Fallback to both if the prop isn't a valid key
				this.selectedGender = BOTH_KEY;
			} else {
				this.setGender(nextGender);
			}
		},
	},
};
</script>
