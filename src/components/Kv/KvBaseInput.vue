<template>
	<div>
		<template v-if="type === 'checkbox'">
			<kv-checkbox
				:id="name"
				:name="name"
				:valid="!validation.$error"
				:value="checkboxValue"
				v-model="inputValue"
				v-bind="$attrs"
			>
				<slot></slot>
			</kv-checkbox>
		</template>
		<template v-if="type === 'text'">
			<label class="tw-block tw-pb-1 tw-uppercase tw-text-small tw-font-medium" :for="name"><slot></slot></label>
			<kv-text-input
				:id="name"
				:name="name"
				class="tw-w-full"
				:valid="!validation.$error"
				v-model="inputValue"
				v-bind="$attrs"
			/>
		</template>
		<slot name="after"></slot>
		<ul
			class="tw-text-danger tw-text-small tw-font-medium tw-mt-1"
			v-show="validation.$error"
		>
			<li
				class="tw-mb-2"
				v-for="error in errors"
				:key="error"
			>
				<slot :name="error"></slot>
			</li>
		</ul>
	</div>
</template>

<script>
import { KvCheckbox, KvTextInput } from '@kiva/kv-components';

export default {
	name: 'KvBaseInput',
	components: {
		KvCheckbox,
		KvTextInput,
	},
	props: {
		// Name of the input. Will be used as the id, so make sure that it is unique to the page.
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'text',
		},
		checkboxValue: {
			type: String,
			default: 'on',
		},
		// Validation object from Vuelidate for this input
		validation: {
			type: Object,
			default() {
				return {};
			},
		},
		modelValue: {
			type: [String, Boolean],
			required: true,
		},
	},
	data() {
		return {
			inputValue: this.modelValue,
		};
	},
	computed: {
		// A named slot will be created for each validator that fails, where the name of the slot will
		// be the key of the validator that failed in the validation object
		errors() {
			return (this.validation.$errors ?? []).map(e => e?.$params?.type);
		},
	},
};
</script>
