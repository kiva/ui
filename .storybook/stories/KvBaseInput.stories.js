import KvBaseInput from '#src/components/Kv/KvBaseInput';

const commonData = {
	vuelidateObject: {
		validationName: false,
		$error: true,
		$params: {
			validationName: {},
		},
	},
};

export default {
	title: 'Kv/Form Elements/KvBaseInput',
	component: KvBaseInput,
};

export const Default = () => ({
	components: {
		KvBaseInput
	},
	data() {
		return {
			...commonData,
		};
	},
	template: `
		<fieldset>
			<legend>Using type=text</legend>
			<kv-base-input
				type="text"
				name="baseInput"
				:validation="{}"
			>
				Base input
			</kv-base-input>
			<kv-base-input
				type="text"
				name="baseInputError"
				:validation="vuelidateObject"
			>
				Base input with error

				<template #validationName>
					There is a problem
				</template>
			</kv-base-input>
		</fieldset>
	`,
	methods: {
		onChange(val) {
			console.log(val);
		}
	}
});
