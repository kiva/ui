import KvCheckbox from '@/components/Kv/KvCheckbox';

export default { title: 'Kv | Form Elements/KvCheckbox' };

export const Default = () => ({
	components: {
		KvCheckbox
	},
	data() {
		return {
			option1: false,
			option2: true,
			option3: false
		}
	},
	template: `
		<fieldset>
			<legend>Using v-model</legend>
			<kv-checkbox
				id="checkbox-1"
				v-model="option1"
				@change="onChange"
				disabled
			>
				Option 1
			</kv-checkbox>
			<kv-checkbox
				id="checkbox-2"
				v-model="option2"
				@change="onChange"
			>
				Option 2
			</kv-checkbox>
			<kv-checkbox
				id="checkbox-3"
				v-model="option3"
				@change="onChange"
			>
				Option 3
			</kv-checkbox>
		</fieldset>
	`,
	methods: {
		onChange(val) {
			console.log(val);
		}
	}
});

export const Checked = () => ({
	components: {
		KvCheckbox
	},
	template: `
		<fieldset>
			<legend>Using :checked</legend>
			<kv-checkbox
				id="checked1"
				:checked="someMethod(true)"
				@change="onChange"
			>
				True by default
			</kv-checkbox>
			<kv-checkbox
				id="checked2"
				:checked="someMethod(false)"
				@change="onChange"
			>
				False by default
			</kv-checkbox>
		</fieldset>
	`,
	methods: {
		onChange(val) {
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
				:checked="true"
				style="font-size: 2rem;"
			>
				2rem
			</kv-checkbox>
			<kv-checkbox
				id="normal"
				:checked="true"
			>
			normal
			</kv-checkbox>
			<kv-checkbox
				id="small"
				:checked="true"
				style="font-size: .875rem;"
			>
				.875rem
			</kv-checkbox>
			<kv-checkbox
				id="smaller"
				:checked="true"
				style="font-size: .75rem;"
			>
				.75rem
			</kv-checkbox>
		</fieldset>
	`,
});
