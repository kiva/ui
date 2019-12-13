import KvRadio from '@/components/Kv/KvRadio';

export default { title: 'Kv | Form Elements/KvRadio' };

export const Default = () => ({
	components: {
		KvRadio
	},
	data() {
		return {
			color: 'red',
		}
	},
	template: `
		<fieldset>
			<legend>What is your favorite color?</legend>
			<kv-radio
				id="color-radio-red"
				radio-value="red"
				v-model="color"
				disabled
			>
				Red
			</kv-radio>
			<kv-radio
				id="color-radio-green"
				radio-value="green"
				v-model="color"
			>
				Green
			</kv-radio>
			<kv-radio
				id="color-radio-blue"
				radio-value="blue"
				v-model="color"
			>
				Blue
			</kv-radio>
		</fieldset>
	`
});

export const FontSized = () => ({
	components: {
		KvRadio
	},
	data() {
		return {
			color: 'green',
		}
	},
	template: `
		<fieldset style="font-size: 2rem;">
			<legend>What is your favorite color?</legend>
			<kv-radio
				id="color-radio-red"
				radio-value="red"
				v-model="color"
				disabled
			>
				Red
			</kv-radio>
			<kv-radio
				id="color-radio-green"
				radio-value="green"
				v-model="color"
			>
				Green
			</kv-radio>
			<kv-radio
				id="color-radio-blue"
				radio-value="blue"
				v-model="color"
			>
				Blue
			</kv-radio>
		</fieldset>
	`
});
