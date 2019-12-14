import KvCheckbox from '@/components/Kv/KvCheckbox';

export default { title: 'Kv | Form Elements/KvCheckbox' };

export const Default = () => ({
	components: {
		KvCheckbox
	},
	data() {
		return {
			kvCheckboxModel1: false,
			kvCheckboxModel2: true,
			kvCheckboxModel3: true,
		}
	},
	template: `
		<fieldset>
			<legend>Using v-model</legend>
			<kv-checkbox
				id="checkbox-1"
				v-model="kvCheckboxModel1"
				@input="onInput"
				disabled
			>
				Option 1
			</kv-checkbox>
			<kv-checkbox
				id="checkbox-2"
				v-model="kvCheckboxModel2"
				@input="onInput"
			>
				Option 2
			</kv-checkbox>
			<kv-checkbox
				id="checkbox-3"
				v-model="kvCheckboxModel3"
				@input="onInput"
			>
				Option 3
			</kv-checkbox>
		</fieldset>
	`,
	methods: {
		onInput(val) {
			console.log(val);
		}
	}
});

export const IsChecked = () => ({
	components: {
		KvCheckbox
	},
	template: `
		<fieldset>
			<legend>Using :is-checked</legend>
			<kv-checkbox
				id="is-checked1"
				:is-checked="someMethod(true)"
				@input="onInput"
			>
				True by default
			</kv-checkbox>
			<kv-checkbox
				id="is-checked2"
				:is-checked="someMethod(false)"
				@input="onInput"
			>
				False by default
			</kv-checkbox>
		</fieldset>
	`,
	methods: {
		onInput(val) {
			console.log(val);
		},
		someMethod(param) {
			return param;
		}
	}
});

export const FontSized = () => ({
	components: {
		KvCheckbox
	},
	template: `
		<fieldset>
			<legend>Font Sized</legend>
			<kv-checkbox
				id="big"
				:is-checked="true"
				style="font-size: 2rem;"
			>
				2rem
			</kv-checkbox>
			<kv-checkbox
				id="normal"
				:is-checked="true"
			>
			normal
			</kv-checkbox>
			<kv-checkbox
				id="small"
				:is-checked="true"
				style="font-size: .875rem;"
			>
				.875rem
			</kv-checkbox>
			<kv-checkbox
				id="smaller"
				:is-checked="true"
				style="font-size: .75rem;"
			>
				.75rem
			</kv-checkbox>
		</fieldset>
	`,
});
