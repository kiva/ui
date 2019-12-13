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
			<div>
				<kv-radio
					id="color-radio-red"
					name="color-radio"
					radio-value="red"
					v-model="color"
					disabled
				>
					Red
				</kv-radio>
			</div>
			<div>
				<kv-radio
					id="color-radio-green"
					name="color-radio"
					radio-value="green"
					v-model="color"
				>
					Green
				</kv-radio>
			</div>
			<div>
				<kv-radio
					id="color-radio-blue"
					name="color-radio-blue"
					radio-value="blue"
					v-model="color"
				>
					Blue
				</kv-radio>
			</div>
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
			<div>
				<kv-radio
					id="color-radio-red"
					name="color-radio"
					radio-value="red"
					v-model="color"
					disabled
				>
					Red
				</kv-radio>
			</div>
			<div>
				<kv-radio
					id="color-radio-green"
					name="color-radio"
					radio-value="green"
					v-model="color"
				>
					Green
				</kv-radio>
			</div>
			<div>
				<kv-radio
					id="color-radio-blue"
					name="color-radio-blue"
					radio-value="blue"
					v-model="color"
				>
					Blue
				</kv-radio>
			</div>
		</fieldset>
	`
});
