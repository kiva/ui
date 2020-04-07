import KvRadio from '@/components/Kv/KvRadio';

export default {
	title: 'Kv/Form Elements/KvRadio',
	component: KvRadio,
};

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

export const MultiLine = () => ({
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
				id="color-radio-blue"
				radio-value="blue"
				v-model="color"
			>
				Blue, I mean red! Lorem ipsum proident occaecat elit voluptate labore eu eiusmod quis elit enim commodo. Officia mollit Lorem do culpa quis consectetur deserunt sunt. Deserunt commodo non labore Lorem reprehenderit incididunt. Qui nisi nisi officia incididunt irure nostrud. Nulla laborum labore adipisicing aute anim sint ullamco adipisicing fugiat adipisicing. Ipsum elit mollit cillum aliquip irure reprehenderit ea duis. Velit duis in laborum sunt tempor adipisicing voluptate eiusmod aute.
			</kv-radio>
			<kv-radio
				id="color-radio-green"
				radio-value="green"
				v-model="color"
			>
				Green
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

export const PillStyle = () => ({
	components: {
		KvRadio
	},
	data() {
		return {
			optionValue: 2,
		}
	},
	template: `
		<fieldset style="font-size: 2rem;">
			<legend>Button Style Radios (Must have at least 2)</legend>
			<kv-radio
				id="radio-option-1"
				radio-value="1"
				v-model="optionValue"
				:pill-style="true"
				disabled
			>
				Option 1
			</kv-radio>
			<kv-radio
				id="radio-option-2"
				radio-value="2"
				v-model="optionValue"
				:pill-style="true"
			>
				Option 2
			</kv-radio>
			<kv-radio
				id="radio-option-3"
				radio-value="3"
				v-model="optionValue"
				:pill-style="true"
			>
				Option 3
			</kv-radio>
		</fieldset>
	`
});
