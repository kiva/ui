import KvRadio from '@/components/Kv/KvRadio';

export default { title: 'Kv | Form Elements/KvRadio' };

export const Default = () => ({
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
			<div>
				<kv-radio
					name="gender-radio"
					radio-value="both"
					v-model="gender"
					disabled
				>
					Everyone
				</kv-radio>
			</div>
			<div>
				<kv-radio
					name="gender-radio"
					radio-value="female"
					v-model="gender"
				>
					Women only
				</kv-radio>
			</div>
			<div>
				<kv-radio
					name="gender-radio"
					radio-value="male"
					v-model="gender"
				>
					Men only
				</kv-radio>
			</div>
		</div>
	`
});

export const FontSized = () => ({
	components: {
		KvRadio
	},
	data() {
		return {
			gender: 'female',
		}
	},
	template: `
		<div style="font-size: 2rem;">
			<div>
				<kv-radio
					name="gender-radio"
					radio-value="both"
					v-model="gender"
					disabled
				>
					Everyone
				</kv-radio>
			</div>
			<div>
				<kv-radio
					name="gender-radio"
					radio-value="female"
					v-model="gender"
				>
					Women only
				</kv-radio>
			</div>
			<div>
				<kv-radio
					name="gender-radio"
					radio-value="male"
					v-model="gender"
				>
					Men only
				</kv-radio>
			</div>
		</div>
	`
});
