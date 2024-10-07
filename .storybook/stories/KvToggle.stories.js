import KvToggle from '#src/components/Kv/KvToggle';

export default {
	title: 'Kv/Form Elements/KvToggle',
	component: KvToggle,
};

export const Default = () => ({
	components: {
		KvToggle
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
			<kv-toggle
				id="toggle-1"
				v-model="option1"
				@change="onChange"
				disabled
			>
				Option 1
			</kv-toggle>
			<kv-toggle
				id="toggle-2"
				v-model="option2"
				@change="onChange"
			>
				Option 2
			</kv-toggle>
			<kv-toggle
				id="toggle-3"
				v-model="option3"
				@change="onChange"
			>
				Option 3
			</kv-toggle>
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
		KvToggle
	},
	template: `
		<fieldset>
			<legend>Using :checked</legend>
			<kv-toggle
				id="checked1"
				:checked="someMethod(true)"
				@change="onChange"
			>
				True by default
			</kv-toggle>
			<kv-toggle
				id="checked2"
				:checked="someMethod(false)"
				@change="onChange"
			>
				False by default
			</kv-toggle>
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
		KvToggle
	},
	template: `
		<fieldset>
			<legend>Font Sized</legend>
			<kv-toggle
				id="big"
				:checked="true"
				style="font-size: 2rem;"
			>
				2rem
			</kv-toggle>
			<kv-toggle
				id="normal"
				:checked="true"
			>
			normal
			</kv-toggle>
			<kv-toggle
				id="small"
				:checked="true"
				style="font-size: .875rem;"
			>
				.875rem
			</kv-toggle>
			<kv-toggle
				id="smaller"
				:checked="true"
				style="font-size: .75rem;"
			>
				.75rem
			</kv-toggle>
		</fieldset>
	`,
});

export const WithContents = () => ({
	components: {
		KvToggle
	},
	template: `
		<fieldset>
			<legend>With Contents</legend>
			<kv-toggle
				id="option-1"
				:checked="true"
			>
				<h2>Big Header</h2>
				<p>Some explanatory text</p>
			</kv-toggle>
			<kv-toggle
				id="option-2"
				:checked="false"
			>
				Option 2
			</kv-toggle>
			<kv-toggle
				id="option-3"
				:checked="false"
			>
				Option 3
			</kv-toggle>
		</fieldset>
	`,
});
