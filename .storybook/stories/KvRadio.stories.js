import KvRadio from '@/components/Kv/KvRadio';

export default {
	title: 'Kv | KvRadio',
	component: KvRadio
};

export const isChecked = () => ({
	components: {
		KvRadio
	},
	data() {
		return {
			gender: 'female',
		}
	},
	template: `
		<div>
			<kv-radio
				label-set="genderRadioSetBoth"
				name-set="genderRadio"
				radio-value="both"
				v-model="gender"
				class="filter-radio"
			>
				Everyone
			</kv-radio>
			<kv-radio
				label-set="genderRadioSetFemale"
				name-set="genderRadio"
				radio-value="female"
				v-model="gender"
				class="filter-radio"
			>
				Women only
			</kv-radio>
			<kv-radio
				label-set="genderRadioSetMale"
				name-set="genderRadio"
				radio-value="male"
				v-model="gender"
				class="filter-radio"
			>
				Men only
			</kv-radio>
		</div>
	`
});
