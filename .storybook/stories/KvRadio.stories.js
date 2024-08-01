import KvRadio from '#src/components/Kv/KvRadio';

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
